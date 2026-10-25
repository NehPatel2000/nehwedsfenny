# Deploying the wedding website and managing RSVPs

This repository contains a public informational wedding site and a family-specific RSVP page at `https://www.nehwedsfenny.com/rsvp/<token>`. Each family link is private; anyone who has it can view and update that family's guest selections.

## Deploy the website

### Prerequisites

- Node.js and npm
- GitHub Pages deployment access for this repository
- AWS Lambda Function URL and DynamoDB `WeddingInvites` table already configured

### Configure the public RSVP endpoint

Set `VITE_RSVP_API_URL` in `.env.production` to the Lambda Function URL. For local development, set the same variable in `.env.local`. These are public endpoint URLs, not AWS credentials. Never place AWS access keys or other secrets in `VITE_` variables.

The production endpoint is configured in the ignored `.env.production` file on the maintainer's machine. When cloning the repository, create that file with the Lambda Function URL before building.

### Publish

From the repository directory, run:

```sh
npm install
npm run deploy
```

The deploy script builds the site, includes the custom-domain `CNAME`, and creates the GitHub Pages `404.html` fallback required for `/rsvp/<token>` links. To test before publishing, configure `.env.local` and run `npm run dev`; open `http://localhost:3000`. If local RSVP calls need to reach Lambda, temporarily add `http://localhost:3000` to the Lambda Function URL's allowed CORS origins.

## Create one family invitation

Run this from the project directory, replacing the example family and guest names:

```sh
node scripts/create-rsvp-invitation.mjs "Patel Family" "Guest One" "Guest Two"
```

The script prints a private RSVP link and a DynamoDB JSON item. In AWS Console, open **DynamoDB → Tables → WeddingInvites → Explore table items → Create item**, choose the JSON editor, paste the item, and save. Privately send the matching link to that family. Keep the link—the token cannot be recovered from the table's hash.

## Add or update many families from Excel or Google Sheets

### Prepare the spreadsheet

1. Open [`examples/rsvp-invitations-template.csv`](./examples/rsvp-invitations-template.csv) in Excel or Google Sheets.
2. Add one family per row. Use `familyName`, `member1`, `member2`, etc. Leave unused guest columns blank.
3. For a new family, leave `token` blank. For an existing family, enter its token from your private links file.
4. Save or download as **CSV UTF-8**.

### Import through AWS CloudShell

1. In AWS Console, open **CloudShell** in the account containing `WeddingInvites` (region `us-east-2`).
2. Choose **Actions → Upload file** and upload:
   - `scripts/import-rsvp-invitations.mjs`
   - Your CSV file (for example, `families.csv`)
3. The AWS identity used by CloudShell needs `dynamodb:GetItem` and `dynamodb:PutItem` permissions on the `WeddingInvites` table. Do not use root credentials or put AWS credentials in the site.
4. Run:

```sh
node import-rsvp-invitations.mjs families.csv --region us-east-2
```

The importer generates 10-character links for rows with blank tokens, hashes them, and writes the invitations to DynamoDB. It creates or updates `private-rsvp-links.csv`; download it using **Actions → Download file** and store it privately. This file contains bearer links that allow changing family RSVPs. Do not commit or share it publicly.

### Edit existing invitation data later

Keep each existing guest in the same `memberN` column and keep the family's token in the `token` column, then re-import the CSV. The importer updates that invitation, preserves saved attendance for unchanged guests, selects added or renamed guests by default, and removes deleted guests. Leave `token` blank only for a new family.

## AWS cost and privacy notes

AWS free-tier eligibility and allowances vary; charges are possible. Set a billing budget alert and review current Lambda, DynamoDB, and CloudWatch pricing. A budget alert is not a spending cap.

The RSVP Function URL is public. A family token is a short bearer credential: anyone who gets the link can view that family's roster and update attendance. Only token hashes are stored in DynamoDB, but protect the generated links file and invitation links.
