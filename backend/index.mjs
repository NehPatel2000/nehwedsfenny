import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const jsonResponse = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

const invitationKey = (token) => ({
  tokenHash: { S: createHash('sha256').update(token).digest('hex') },
});

const createRsvpToken = () => randomBytes(8).toString('base64url').slice(0, 10);
const publicRsvpKey = (token) => ({
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

const isAttendanceValid = (attending, people) =>
  typeof attending === 'boolean'
  && Number.isSafeInteger(people)
  && people >= 0
  && (attending ? people > 0 : people === 0);

const validateAttendanceFields = (value) => {
  const fields = [
    ['grahShantiAttending', 'grahShantiPeople'],
    ['pithiAttending', 'pithiPeople'],
    ['weddingAttending', 'weddingPeople'],
  ];
  if (fields.some(([attending, people]) => !isAttendanceValid(value[attending], value[people]))) {
    return { error: 'For each event, enter a valid attendance choice and guest count.' };
  }
  return {
    value: Object.fromEntries(fields.flatMap(([attending, people]) => [
      [attending, value[attending]],
      [people, value[people]],
    ])),
  };
};

const isValidEmail = (email) => {
  if (email.length > 254) return false;
  const [local, domain, ...extra] = email.split('@');
  if (!local || !domain || extra.length > 0 || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return false;
  }
  if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
  const labels = domain.split('.');
  if (labels.length < 2) return false;
  if (labels.some((label) => (
    label.length === 0
    || label.length > 63
    || !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)
  ))) return false;
  return /^[A-Za-z]{2,63}$/.test(labels.at(-1));
};

const isValidUsPhone = (phone) => {
  return /^(?:\+?1[ .-]?)?(?:\([2-9](?!11)[0-9]{2}\)|[2-9](?!11)[0-9]{2})[ .-]?[2-9](?!11)[0-9]{2}[ .-]?[0-9]{4}$/.test(phone);
};

export const validatePublicRsvp = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { error: 'Request body must be a JSON object.' };
  }
  if (typeof value.displayName !== 'string' || value.displayName.trim().length === 0 || value.displayName.trim().length > 100) {
    return { error: 'Enter a display name between 1 and 100 characters.' };
  }
  const attendance = validateAttendanceFields(value);
  if (attendance.error) return attendance;
  return { value: { displayName: value.displayName.trim(), ...attendance.value } };
};

export const validateSeedRsvp = (value) => {
  const publicRsvp = validatePublicRsvp(value);
  if (publicRsvp.error) return publicRsvp;
  if (typeof value.internalName !== 'string' || value.internalName.trim().length > 100) {
    return { error: 'Internal name must be 100 characters or fewer.' };
  }
  const phone = value.phone === undefined ? '' : value.phone;
  const email = value.email === undefined ? '' : value.email;
  if (typeof phone !== 'string' || phone.trim().length > 40 || (phone.trim() !== '' && !isValidUsPhone(phone.trim()))) {
    return { error: 'Enter a valid 10-digit U.S. phone number.' };
  }
  if (
    typeof email !== 'string'
    || (email.trim() !== '' && !isValidEmail(email.trim()))
  ) {
    return { error: 'Enter a valid email address up to 254 characters long.' };
  }
  if (value.side !== 'bride' && value.side !== 'groom') {
    return { error: 'Choose either the bride or groom side.' };
  }
  return {
    value: {
      ...publicRsvp.value,
      internalName: value.internalName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      side: value.side,
    },
  };
};

const parseRequestBody = (event) => {
  if (typeof event.body !== 'string' || Buffer.byteLength(event.body, 'utf8') > 8192) {
    return { error: 'Request body is missing or too large.' };
  }
  try {
    const text = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    return { value: JSON.parse(text) };
  } catch {
    return { error: 'Request body must contain valid JSON.' };
  }
};

const hasValidAdminCredentials = (authorization) => {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return null;
  if (typeof authorization !== 'string' || !authorization.startsWith('Basic ')) return false;

  let decoded;
  try {
    decoded = Buffer.from(authorization.slice(6), 'base64').toString('utf8');
  } catch {
    return false;
  }
  const separator = decoded.indexOf(':');
  if (separator < 0) return false;
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  const expected = createHash('sha256').update(`${expectedUsername}:${expectedPassword}`).digest();
  const actual = createHash('sha256').update(`${username}:${password}`).digest();
  return timingSafeEqual(actual, expected);
};

const readStoredValue = (item, attribute, type) => item?.[attribute]?.[type];

const listAdminRsvps = async (client, ScanCommand, tableName) => {
  const rsvps = [];
  let lastEvaluatedKey;
  do {
    const result = await client.send(new ScanCommand({
      TableName: tableName,
      FilterExpression: '#recordType = :recordType',
      ProjectionExpression: '#displayName, #internalName, #phone, #email, #side, #shareToken, #grahShantiAttending, #grahShantiPeople, #pithiAttending, #pithiPeople, #weddingAttending, #weddingPeople, #updatedAt',
      ExpressionAttributeNames: {
        '#recordType': 'recordType',
        '#displayName': 'displayName',
        '#internalName': 'internalName',
        '#phone': 'phone',
        '#email': 'email',
        '#side': 'side',
        '#shareToken': 'shareToken',
        '#grahShantiAttending': 'grahShantiAttending',
        '#grahShantiPeople': 'grahShantiPeople',
        '#pithiAttending': 'pithiAttending',
        '#pithiPeople': 'pithiPeople',
        '#weddingAttending': 'weddingAttending',
        '#weddingPeople': 'weddingPeople',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: { ':recordType': { S: 'public-rsvp' } },
      ExclusiveStartKey: lastEvaluatedKey,
    }));
    for (const item of result.Items ?? []) {
      const displayName = readStoredValue(item, 'displayName', 'S');
      const updatedAt = readStoredValue(item, 'updatedAt', 'S');
      if (typeof displayName === 'string' && typeof updatedAt === 'string') {
        rsvps.push({
          displayName,
          internalName: readStoredValue(item, 'internalName', 'S') ?? '',
          phone: readStoredValue(item, 'phone', 'S') ?? '',
          email: readStoredValue(item, 'email', 'S') ?? '',
          side: readStoredValue(item, 'side', 'S') ?? 'unassigned',
          shareToken: readStoredValue(item, 'shareToken', 'S') ?? '',
          grahShantiAttending: readStoredValue(item, 'grahShantiAttending', 'BOOL') === true,
          grahShantiPeople: readStoredValue(item, 'grahShantiPeople', 'N') ? Number(item.grahShantiPeople.N) : 0,
          pithiAttending: readStoredValue(item, 'pithiAttending', 'BOOL') === true,
          pithiPeople: readStoredValue(item, 'pithiPeople', 'N') ? Number(item.pithiPeople.N) : 0,
          weddingAttending: readStoredValue(item, 'weddingAttending', 'BOOL') === true,
          weddingPeople: readStoredValue(item, 'weddingPeople', 'N') ? Number(item.weddingPeople.N) : 0,
          updatedAt,
        });
      }
    }
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return rsvps.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
};

const rsvpAttributes = (value) => {
  const attributes = {};
  for (const [key, fieldType] of [
    ['grahShantiAttending', 'BOOL'],
    ['grahShantiPeople', 'N'],
    ['pithiAttending', 'BOOL'],
    ['pithiPeople', 'N'],
    ['weddingAttending', 'BOOL'],
    ['weddingPeople', 'N'],
  ]) {
    attributes[key] = { [fieldType]: fieldType === 'N' ? String(value[key]) : value[key] };
  }
  return attributes;
};

const storeAdminRsvp = async (client, PutItemCommand, tableName, value) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const token = createRsvpToken();
    const item = {
      ...publicRsvpKey(token),
      recordType: { S: 'public-rsvp' },
      displayName: { S: value.displayName },
      internalName: { S: value.internalName },
      ...(value.phone ? { phone: { S: value.phone } } : {}),
      ...(value.email ? { email: { S: value.email } } : {}),
      side: { S: value.side },
      shareToken: { S: token },
      updatedAt: { S: new Date().toISOString() },
      ...rsvpAttributes(value),
    };
    try {
      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(tokenHash)',
      }));
      return token;
    } catch (error) {
      if (error?.name !== 'ConditionalCheckFailedException') throw error;
    }
  }
  throw new Error('Could not generate an available RSVP token after several attempts.');
};

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method;
  const path = event?.rawPath ?? '';
  const publicRsvpPath = /^\/rsvp\/?$/.test(path);
  const adminRsvpsPath = /^\/admin\/rsvps\/?$/.test(path);
  const publicTokenMatch = /^\/rsvp\/(?:guest\/([A-Za-z0-9_-]{10})|([a-f0-9]{64}))\/?$/.exec(path);
  const tokenToShortenMatch = /^\/admin\/rsvps\/([a-f0-9]{64})\/short-link\/?$/.exec(path);
  const invitationMatch = /^\/rsvp\/([A-Za-z0-9_-]{10})\/?$/.exec(path);

  if (publicRsvpPath) {
    return jsonResponse(403, { error: 'RSVPs require the personal link shared with your invitation.' });
  }

  if (!adminRsvpsPath && !tokenToShortenMatch && !publicTokenMatch && !invitationMatch) {
    return jsonResponse(404, { error: 'Endpoint not found.' });
  }
  if (adminRsvpsPath && method !== 'GET' && method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }
  if (tokenToShortenMatch && method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }
  if ((publicTokenMatch || invitationMatch) && method !== 'GET' && method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  if (adminRsvpsPath || tokenToShortenMatch) {
    const credentialsValid = hasValidAdminCredentials(event.headers?.authorization ?? event.headers?.Authorization);
    if (credentialsValid === null) {
      console.error('ADMIN_USERNAME or ADMIN_PASSWORD is not configured');
      return jsonResponse(500, { error: 'Admin access is not configured.' });
    }
    if (!credentialsValid) {
      return jsonResponse(401, { error: 'Unauthorized.' }, { 'www-authenticate': 'Basic realm="Wedding RSVP Admin"' });
    }
  }

  const tableName = process.env.RSVP_TABLE_NAME;
  if (!tableName) {
    console.error('RSVP_TABLE_NAME is not configured');
    return jsonResponse(500, { error: 'RSVP service is not configured.' });
  }

  try {
    const { DynamoDBClient, GetItemCommand, UpdateItemCommand, PutItemCommand, ScanCommand } = await import('@aws-sdk/client-dynamodb');
    const client = new DynamoDBClient({});
    if (publicTokenMatch) {
      const token = publicTokenMatch[1] ?? publicTokenMatch[2];
      let key = publicRsvpKey(token);
      let { Item } = await client.send(new GetItemCommand({ TableName: tableName, Key: key }));
      if (Item?.recordType?.S === 'public-rsvp-alias' && typeof Item.targetTokenHash?.S === 'string') {
        key = { tokenHash: { S: Item.targetTokenHash.S } };
        const canonical = await client.send(new GetItemCommand({
          TableName: tableName,
          Key: key,
        }));
        Item = canonical.Item;
      }
      if (Item?.recordType?.S !== 'public-rsvp') return jsonResponse(404, { error: 'RSVP link not found.' });

      if (method === 'GET') {
        return jsonResponse(200, {
          displayName: readStoredValue(Item, 'displayName', 'S') ?? '',
          ...Object.fromEntries(Object.entries(rsvpAttributes({
            grahShantiAttending: readStoredValue(Item, 'grahShantiAttending', 'BOOL') === true,
            grahShantiPeople: Number(readStoredValue(Item, 'grahShantiPeople', 'N') ?? 0),
            pithiAttending: readStoredValue(Item, 'pithiAttending', 'BOOL') === true,
            pithiPeople: Number(readStoredValue(Item, 'pithiPeople', 'N') ?? 0),
            weddingAttending: readStoredValue(Item, 'weddingAttending', 'BOOL') === true,
            weddingPeople: Number(readStoredValue(Item, 'weddingPeople', 'N') ?? 0),
          })).map(([name, attribute]) => [name, attribute.BOOL ?? Number(attribute.N)])),
        });
      }

      const body = parseRequestBody(event);
      if (body.error) return jsonResponse(400, { error: body.error });
      const result = validatePublicRsvp(body.value);
      if (result.error) return jsonResponse(400, { error: result.error });
      await client.send(new UpdateItemCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: 'SET displayName = :displayName, grahShantiAttending = :grahShantiAttending, grahShantiPeople = :grahShantiPeople, pithiAttending = :pithiAttending, pithiPeople = :pithiPeople, weddingAttending = :weddingAttending, weddingPeople = :weddingPeople, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':displayName': { S: result.value.displayName },
          ...Object.fromEntries(Object.entries(rsvpAttributes(result.value)).map(([name, attribute]) => [`:${name}`, attribute])),
          ':updatedAt': { S: new Date().toISOString() },
        },
      }));
      return jsonResponse(200, { message: 'RSVP saved successfully.', token: readStoredValue(Item, 'shareToken', 'S') ?? token });
    }

    if (tokenToShortenMatch) {
      const oldToken = tokenToShortenMatch[1];
      const canonicalKey = publicRsvpKey(oldToken);
      const { Item } = await client.send(new GetItemCommand({ TableName: tableName, Key: canonicalKey }));
      if (Item?.recordType?.S !== 'public-rsvp') return jsonResponse(404, { error: 'RSVP not found.' });
      const currentToken = readStoredValue(Item, 'shareToken', 'S');
      if (currentToken && /^[A-Za-z0-9_-]{10}$/.test(currentToken)) {
        return jsonResponse(200, { token: currentToken });
      }

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const token = createRsvpToken();
        try {
          await client.send(new PutItemCommand({
            TableName: tableName,
            Item: {
              ...publicRsvpKey(token),
              recordType: { S: 'public-rsvp-alias' },
              targetTokenHash: canonicalKey.tokenHash,
            },
            ConditionExpression: 'attribute_not_exists(tokenHash)',
          }));
        } catch (error) {
          if (error?.name === 'ConditionalCheckFailedException') continue;
          throw error;
        }
        await client.send(new UpdateItemCommand({
          TableName: tableName,
          Key: canonicalKey,
          UpdateExpression: 'SET shareToken = :shareToken',
          ExpressionAttributeValues: { ':shareToken': { S: token } },
        }));
        return jsonResponse(200, { token });
      }
      throw new Error('Could not generate an available RSVP token after several attempts.');
    }

    if (adminRsvpsPath) {
      if (method === 'GET') {
        const rsvps = await listAdminRsvps(client, ScanCommand, tableName);
        return jsonResponse(200, { rsvps });
      }
      const body = parseRequestBody(event);
      if (body.error) return jsonResponse(400, { error: body.error });
      const result = validateSeedRsvp(body.value);
      if (result.error) return jsonResponse(400, { error: result.error });
      const token = await storeAdminRsvp(client, PutItemCommand, tableName, result.value);
      return jsonResponse(201, { message: 'Internal RSVP added successfully.', token });
    }

    const token = invitationMatch[1];
    const key = invitationKey(token);
    const { Item } = await client.send(new GetItemCommand({ TableName: tableName, Key: key }));
    const invitation = parseInvitation(Item);
    if (!invitation) return jsonResponse(404, { error: 'Invitation not found.' });

    if (method === 'GET') {
      return jsonResponse(200, invitation);
    }

    const body = parseRequestBody(event);
    if (body.error) return jsonResponse(400, { error: body.error });
    const result = validateRsvp(body.value, invitation.members);
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
    console.error('Failed to process RSVP request in DynamoDB', error);
    return jsonResponse(500, { error: 'We could not load or save your RSVP. Please try again.' });
  }

  return jsonResponse(200, { message: 'RSVP saved successfully.' });
};
