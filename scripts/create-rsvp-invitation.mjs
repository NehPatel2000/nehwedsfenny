import { createHash, randomBytes } from 'node:crypto';

const [familyName, ...names] = process.argv.slice(2);
if (!familyName || names.length === 0) {
  console.error('Usage: node scripts/create-rsvp-invitation.mjs "Family Name" "Guest One" "Guest Two"');
  process.exitCode = 1;
} else {
  const token = randomBytes(8).toString('base64url').slice(0, 10);
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const item = {
    tokenHash: { S: tokenHash },
    familyName: { S: familyName },
    members: {
      L: names.map((name, index) => ({
        M: {
          id: { S: `member-${index + 1}` },
          name: { S: name },
        },
      })),
    },
  };

  console.log(`Private RSVP link: https://www.nehwedsfenny.com/rsvp/${token}`);
  console.log('Add this item to the WeddingInvites DynamoDB table using the DynamoDB JSON editor:');
  console.log(JSON.stringify(item, null, 2));
  console.warn('Keep the private RSVP link private. The database item contains only its SHA-256 hash.');
}
