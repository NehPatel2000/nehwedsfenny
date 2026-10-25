import { createHash } from 'node:crypto';

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

const invitationKey = (token) => ({
  tokenHash: { S: createHash('sha256').update(token).digest('hex') },
});

const parseInvitation = (item) => {
  if (!item || typeof item.familyName?.S !== 'string' || !Array.isArray(item.members?.L)) {
    return null;
  }

  const members = item.members.L.map(({ M }) => ({
    id: M?.id?.S,
    name: M?.name?.S,
  }));
  if (members.some((member) => !member.id || !member.name)) {
    return null;
  }

  const memberIds = new Set(members.map(({ id }) => id));
  const attendeesFor = (attribute) => {
    const stored = item[attribute]?.L;
    if (!stored) return members.map(({ id }) => id);
    return stored.map(({ S }) => S).filter((id) => memberIds.has(id));
  };

  return {
    familyName: item.familyName.S,
    members,
    attendingDay1: attendeesFor('attendingDay1'),
    attendingDay2: attendeesFor('attendingDay2'),
  };
};

export const validateRsvp = (value, members) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { error: 'Request body must be a JSON object.' };
  }

  const memberIds = new Set(members.map(({ id }) => id));
  for (const event of ['attendingDay1', 'attendingDay2']) {
    if (!Array.isArray(value[event]) || value[event].some((id) => typeof id !== 'string' || !memberIds.has(id))) {
      return { error: 'Select only guests listed on this invitation.' };
    }
  }

  return { value: { attendingDay1: value.attendingDay1, attendingDay2: value.attendingDay2 } };
};

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method;
  const match = /^\/rsvp\/([A-Za-z0-9_-]{10})\/?$/.exec(event?.rawPath ?? '');
  if (!match) return jsonResponse(404, { error: 'Invitation not found.' });
  if (method !== 'GET' && method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const tableName = process.env.RSVP_TABLE_NAME;
  if (!tableName) {
    console.error('RSVP_TABLE_NAME is not configured');
    return jsonResponse(500, { error: 'RSVP service is not configured.' });
  }

  const token = match[1];
  try {
    const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = await import('@aws-sdk/client-dynamodb');
    const client = new DynamoDBClient({});
    const key = invitationKey(token);
    const { Item } = await client.send(new GetItemCommand({ TableName: tableName, Key: key }));
    const invitation = parseInvitation(Item);
    if (!invitation) return jsonResponse(404, { error: 'Invitation not found.' });

    if (method === 'GET') {
      return jsonResponse(200, invitation);
    }

    if (typeof event.body !== 'string' || Buffer.byteLength(event.body, 'utf8') > 8192) {
      return jsonResponse(400, { error: 'Request body is missing or too large.' });
    }

    let body;
    try {
      const text = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;
      body = JSON.parse(text);
    } catch {
      return jsonResponse(400, { error: 'Request body must contain valid JSON.' });
    }

    const result = validateRsvp(body, invitation.members);
    if (result.error) return jsonResponse(400, { error: result.error });

    await client.send(new UpdateItemCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: 'SET attendingDay1 = :day1, attendingDay2 = :day2, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':day1': { L: result.value.attendingDay1.map((id) => ({ S: id })) },
        ':day2': { L: result.value.attendingDay2.map((id) => ({ S: id })) },
        ':updatedAt': { S: new Date().toISOString() },
      },
    }));
  } catch (error) {
    console.error('Failed to read or save invitation in DynamoDB', error);
    return jsonResponse(500, { error: 'We could not load or save your RSVP. Please try again.' });
  }

  return jsonResponse(200, { message: 'RSVP saved successfully.' });
};
