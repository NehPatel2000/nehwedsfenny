import { createHash, randomBytes } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const defaultRegion = 'us-east-2';
const defaultTable = 'WeddingInvites';
const siteUrl = 'https://www.nehwedsfenny.com';

export const parseCsv = (text) => {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('CSV has an unclosed quoted field.');
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
};

const dynamoJson = (value) => JSON.stringify(value);

const aws = (args) => execFileSync('aws', args, { encoding: 'utf8' });

const getItem = (table, region, tokenHash) => {
  const output = aws([
    'dynamodb', 'get-item',
    '--table-name', table,
    '--key', dynamoJson({ tokenHash: { S: tokenHash } }),
    '--region', region,
    '--consistent-read',
    '--output', 'json',
  ]);
  return JSON.parse(output).Item;
};

const makeToken = () => randomBytes(8).toString('base64url').slice(0, 10);
const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export const getSelectedIds = (previousItem, attribute, members) => {
  const memberIds = members.map(({ id }) => id);
  if (!previousItem) return memberIds;
  const oldMembers = new Map((previousItem.members?.L ?? [])
    .map(({ M }) => [M?.id?.S, M?.name?.S])
    .filter(([id, name]) => id && name));
  const previousSelection = previousItem[attribute]?.L?.map(({ S }) => S);
  if (!previousSelection) return memberIds;
  const currentNames = new Map(members.map(({ id, name }) => [id, name]));
  const selected = new Set(previousSelection.filter((id) =>
    memberIds.includes(id) && oldMembers.get(id) === currentNames.get(id)));
  for (const { id, name } of members) {
    if (!oldMembers.has(id) || oldMembers.get(id) !== name) selected.add(id);
  }
  return [...selected];
};

export const buildInvitationItem = (familyName, members, previousItem) => ({
    ...(previousItem?.attendingDay1?.L ? {
      attendingDay1: {
        L: getSelectedIds(previousItem, 'attendingDay1', members).map((id) => ({ S: id })),
      },
    } : {}),
    ...(previousItem?.attendingDay2?.L ? {
      attendingDay2: {
        L: getSelectedIds(previousItem, 'attendingDay2', members).map((id) => ({ S: id })),
      },
    } : {}),
    familyName: { S: familyName },
    members: {
      L: members.map(({ id, name }) => ({
        M: { id: { S: id }, name: { S: name } },
      })),
    },
    updatedAt: { S: new Date().toISOString() },
    ...(previousItem?.createdAt ? { createdAt: previousItem.createdAt } : { createdAt: { S: new Date().toISOString() } }),
  });

export const parseInvitationsCsv = (text) => {
  const [rawHeaders, ...dataRows] = parseCsv(text);
  if (!rawHeaders) throw new Error('CSV is empty.');
  const headers = rawHeaders.map((header) => header.trim());
  const familyIndex = headers.indexOf('familyName');
  const tokenIndex = headers.indexOf('token');
  const memberColumns = headers
    .map((header, index) => ({ header, index, match: /^member(\d+)$/.exec(header) }))
    .filter(({ match }) => match)
    .sort((left, right) => Number(left.match[1]) - Number(right.match[1]));

  if (familyIndex < 0 || memberColumns.length === 0) {
    throw new Error('CSV must include familyName and at least one member1, member2, etc. column.');
  }
  memberColumns.forEach(({ match }, index) => {
    if (Number(match[1]) !== index + 1) {
      throw new Error('Member columns must be consecutive, starting with member1.');
    }
  });

  return dataRows.map((values, rowIndex) => {
    const familyName = (values[familyIndex] ?? '').trim();
    const members = memberColumns
      .map(({ index, match }) => ({
        id: `member-${match[1]}`,
        name: (values[index] ?? '').trim(),
      }))
      .filter(({ name }) => name);
    const token = tokenIndex >= 0 ? (values[tokenIndex] ?? '').trim() : '';

    if (!familyName || members.length === 0) {
      throw new Error(`CSV row ${rowIndex + 2} needs a familyName and at least one guest name.`);
    }
    if (token && !/^[A-Za-z0-9_-]{10}$/.test(token)) {
      throw new Error(`CSV row ${rowIndex + 2} has an invalid token; use the 10-character token from the links file.`);
    }

    return { familyName, members, token };
  });
};

const parseArgs = (args) => {
  const options = { region: process.env.AWS_REGION || defaultRegion, table: process.env.RSVP_TABLE_NAME || defaultTable };
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--region') options.region = args[++index];
    else if (args[index] === '--table') options.table = args[++index];
    else if (args[index] === '--links-file') options.linksFile = args[++index];
    else if (args[index].startsWith('--')) throw new Error(`Unknown option: ${args[index]}`);
    else positional.push(args[index]);
  }
  if (positional.length !== 1) {
    throw new Error('Usage: node scripts/import-rsvp-invitations.mjs invitations.csv [--region us-east-2] [--links-file private-rsvp-links.csv]');
  }
  options.csvFile = positional[0];
  options.linksFile ??= 'private-rsvp-links.csv';
  return options;
};

export const importInvitations = ({ csvFile, linksFile, region, table }) => {
  const invitations = parseInvitationsCsv(readFileSync(csvFile, 'utf8'));
  const outputLinks = [];
  const seenTokens = new Set();
  const importPlan = [];

  for (const invitation of invitations) {
    const token = invitation.token || makeToken();
    if (seenTokens.has(token)) throw new Error(`Duplicate token in CSV for ${invitation.familyName}.`);
    seenTokens.add(token);
    const tokenHash = hashToken(token);
    const previousItem = getItem(table, region, tokenHash);
    if (!invitation.token && previousItem) {
      throw new Error('Generated invitation token collision; rerun the import.');
    }

    const item = buildInvitationItem(invitation.familyName, invitation.members, previousItem);
    importPlan.push({ token, tokenHash, previousItem, item, familyName: invitation.familyName });
    outputLinks.push({
      familyName: invitation.familyName,
      token,
      url: `${siteUrl}/rsvp/${token}`,
    });
  }

  const previousLinks = existsSync(linksFile)
    ? parseCsv(readFileSync(linksFile, 'utf8')).slice(1)
      .map(([familyName, token, url]) => ({ familyName, token, url }))
      .filter(({ token }) => token)
    : [];
  const linksByToken = new Map(previousLinks.map((link) => [link.token, link]));
  for (const link of outputLinks) linksByToken.set(link.token, link);
  const linksCsv = [
    'familyName,token,url',
    ...[...linksByToken.values()].map(({ familyName, token, url }) =>
      `"${familyName.replaceAll('"', '""')}","${token}","${url}"`),
  ].join('\n') + '\n';
  writeFileSync(linksFile, linksCsv, { mode: 0o600 });
  chmodSync(linksFile, 0o600);

  for (const { tokenHash, previousItem, item } of importPlan) {
    aws([
      'dynamodb', 'put-item',
      '--table-name', table,
      '--item', dynamoJson({ tokenHash: { S: tokenHash }, ...item }),
      '--condition-expression', previousItem
        ? 'attribute_exists(tokenHash)'
        : 'attribute_not_exists(tokenHash)',
      '--region', region,
    ]);
  }

  return { count: invitations.length, linksFile };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = importInvitations(parseArgs(process.argv.slice(2)));
    console.log(`Imported ${result.count} invitations into DynamoDB.`);
    console.log(`Private family links saved to ${result.linksFile} (owner-only permissions).`);
    console.log('Keep this file private. To edit an invitation later, include its token in the CSV token column and rerun the import.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
