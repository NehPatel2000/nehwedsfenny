import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { handler, validateRsvp, validatePublicRsvp, validateSeedRsvp } from './index.mjs';

const members = [
  { id: 'member-1', name: 'Alice' },
  { id: 'member-2', name: 'Bob' },
];

describe('validateRsvp', () => {
  it('accepts different valid guest selections for each event', () => {
    assert.deepEqual(validateRsvp({
      attendingDay1: ['member-1'],
      attendingDay2: ['member-1', 'member-2'],
    }, members), {
      value: {
        attendingDay1: ['member-1'],
        attendingDay2: ['member-1', 'member-2'],
      },
    });
  });

  it('allows a family to decline every event', () => {
    assert.deepEqual(validateRsvp({
      attendingDay1: [],
      attendingDay2: [],
    }, members).value, {
      attendingDay1: [],
      attendingDay2: [],
    });
  });

  it('rejects malformed responses and guests not on the invitation', () => {
    assert.ok(validateRsvp(null, members).error);
    assert.ok(validateRsvp({ attendingDay1: 'member-1', attendingDay2: [] }, members).error);
    assert.ok(validateRsvp({ attendingDay1: ['unknown'], attendingDay2: [] }, members).error);
    assert.ok(validateRsvp({ attendingDay1: [], attendingDay2: [null] }, members).error);
  });
});

describe('validatePublicRsvp', () => {
  const validResponse = {
    displayName: '  Alice Smith  ',
    grahShantiAttending: true,
    grahShantiPeople: 2,
    pithiAttending: false,
    pithiPeople: 0,
    weddingAttending: true,
    weddingPeople: 1,
  };

  it('trims the display name and accepts event attendance counts', () => {
    assert.deepEqual(validatePublicRsvp(validResponse), {
      value: { ...validResponse, displayName: 'Alice Smith' },
    });
  });

  it('rejects missing names and inconsistent attendance counts', () => {
    assert.ok(validatePublicRsvp({ ...validResponse, displayName: '  ' }).error);
    assert.ok(validatePublicRsvp({ ...validResponse, grahShantiPeople: 0 }).error);
    assert.ok(validatePublicRsvp({ ...validResponse, pithiAttending: true, pithiPeople: 0 }).error);
    assert.ok(validatePublicRsvp({ ...validResponse, weddingPeople: 1.5 }).error);
  });
});

describe('validateSeedRsvp', () => {
  it('accepts internal-only name and bride/groom side metadata', () => {
    assert.deepEqual(validateSeedRsvp({
      displayName: 'Guest',
      internalName: 'Cousin on Mom side',
      phone: '+1 212 555 4567',
      email: 'cousin@example.com',
      side: 'groom',
      grahShantiAttending: false,
      grahShantiPeople: 0,
      pithiAttending: false,
      pithiPeople: 0,
      weddingAttending: true,
      weddingPeople: 2,
    }).value, {
      displayName: 'Guest',
      internalName: 'Cousin on Mom side',
      phone: '+1 212 555 4567',
      email: 'cousin@example.com',
      side: 'groom',
      grahShantiAttending: false,
      grahShantiPeople: 0,
      pithiAttending: false,
      pithiPeople: 0,
      weddingAttending: true,
      weddingPeople: 2,
    });
  });

  it('allows an empty internal name but rejects invalid sides', () => {
    const seed = {
      displayName: 'Guest',
      internalName: '',
      side: 'neither',
      grahShantiAttending: false,
      grahShantiPeople: 0,
      pithiAttending: false,
      pithiPeople: 0,
      weddingAttending: false,
      weddingPeople: 0,
    };
    assert.ok(validateSeedRsvp(seed).error);
    assert.equal(validateSeedRsvp({ ...seed, side: 'bride' }).value.internalName, '');
    assert.equal(validateSeedRsvp({ ...seed, side: 'bride' }).value.phone, '');
    assert.equal(validateSeedRsvp({ ...seed, side: 'bride' }).value.email, '');
    assert.ok(validateSeedRsvp({ ...seed, side: 'bride', email: 'not-an-email' }).error);
    assert.ok(validateSeedRsvp({ ...seed, side: 'bride', phone: 'p'.repeat(41) }).error);
  });

  it('accepts valid email syntax and U.S. phone formats, and rejects invalid values', () => {
    const seed = {
      displayName: 'Guest',
      internalName: '',
      side: 'bride',
      grahShantiAttending: false,
      grahShantiPeople: 0,
      pithiAttending: false,
      pithiPeople: 0,
      weddingAttending: false,
      weddingPeople: 0,
    };
    for (const phone of ['(212) 555-1234', '212-555-1234', '+1 212 555 1234', '1.212.555.1234', '2125551234']) {
      assert.equal(validateSeedRsvp({ ...seed, phone, email: 'person.name+tag@example.co.uk' }).value.phone, phone);
    }
    for (const phone of ['random text', 'abc2125551234', '123-555-1234', '212-155-1234', '212-555-123', '+44 212 555 1234', '212-555-1234 ext 5', '+1+2125551234']) {
      assert.ok(validateSeedRsvp({ ...seed, phone }).error, `Expected ${phone} to be invalid`);
    }
    for (const email of ['a@b.c', 'name..last@example.com', 'name@-example.com', 'name@example', 'name@example.c0m']) {
      assert.ok(validateSeedRsvp({ ...seed, email }).error, `Expected ${email} to be invalid`);
    }
  });
});

describe('handler', () => {
  it('does not allow RSVP creation without a seeded personal link', async () => {
    const response = await handler({
      rawPath: '/rsvp',
      body: JSON.stringify({
        displayName: 'Guest',
        grahShantiAttending: false,
        grahShantiPeople: 0,
        pithiAttending: false,
        pithiPeople: 0,
        weddingAttending: false,
        weddingPeople: 0,
      }),
      requestContext: { http: { method: 'POST' } },
    });
    assert.equal(response.statusCode, 403);
    assert.match(response.body, /personal link shared with your invitation/);
  });

  it('rejects paths that do not contain a full opaque invitation token', async () => {
    const response = await handler({
      rawPath: '/rsvp/not-a-token',
      requestContext: { http: { method: 'GET' } },
    });
    assert.equal(response.statusCode, 404);
  });

  it('recognizes the opaque RSVP edit-link route', async () => {
    const previousTableName = process.env.RSVP_TABLE_NAME;
    delete process.env.RSVP_TABLE_NAME;
    try {
      const response = await handler({
        rawPath: `/rsvp/${'a'.repeat(64)}`,
        requestContext: { http: { method: 'GET' } },
      });
      assert.equal(response.statusCode, 500);
      assert.match(response.body, /RSVP service is not configured/);
    } finally {
      if (previousTableName === undefined) delete process.env.RSVP_TABLE_NAME;
      else process.env.RSVP_TABLE_NAME = previousTableName;
    }
  });

  it('recognizes a short seeded RSVP token route', async () => {
    const previousTableName = process.env.RSVP_TABLE_NAME;
    delete process.env.RSVP_TABLE_NAME;
    try {
      const response = await handler({
        rawPath: '/rsvp/guest/AbcD_123-X',
        requestContext: { http: { method: 'GET' } },
      });
      assert.equal(response.statusCode, 500);
      assert.match(response.body, /RSVP service is not configured/);
    } finally {
      if (previousTableName === undefined) delete process.env.RSVP_TABLE_NAME;
      else process.env.RSVP_TABLE_NAME = previousTableName;
    }
  });

  it('requires admin authentication to shorten an existing RSVP link', async () => {
    const previousUsername = process.env.ADMIN_USERNAME;
    const previousPassword = process.env.ADMIN_PASSWORD;
    const previousTableName = process.env.RSVP_TABLE_NAME;
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'test-password';
    delete process.env.RSVP_TABLE_NAME;
    try {
      const request = {
        rawPath: `/admin/rsvps/${'a'.repeat(64)}/short-link`,
        requestContext: { http: { method: 'POST' } },
      };
      const unauthorized = await handler(request);
      assert.equal(unauthorized.statusCode, 401);

      const authorized = await handler({
        ...request,
        headers: { authorization: `Basic ${Buffer.from('admin:test-password').toString('base64')}` },
      });
      assert.equal(authorized.statusCode, 500);
      assert.match(authorized.body, /RSVP service is not configured/);
    } finally {
      if (previousUsername === undefined) delete process.env.ADMIN_USERNAME;
      else process.env.ADMIN_USERNAME = previousUsername;
      if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD;
      else process.env.ADMIN_PASSWORD = previousPassword;
      if (previousTableName === undefined) delete process.env.RSVP_TABLE_NAME;
      else process.env.RSVP_TABLE_NAME = previousTableName;
    }
  });

  it('requires the invitation table to be configured', async () => {
    const previousTableName = process.env.RSVP_TABLE_NAME;
    delete process.env.RSVP_TABLE_NAME;
    try {
      const response = await handler({
        rawPath: `/rsvp/${'a'.repeat(10)}`,
        requestContext: { http: { method: 'GET' } },
      });
      assert.equal(response.statusCode, 500);
    } finally {
      if (previousTableName === undefined) delete process.env.RSVP_TABLE_NAME;
      else process.env.RSVP_TABLE_NAME = previousTableName;
    }
  });

  it('requires configured admin credentials and rejects unauthenticated admin access', async () => {
    const previousUsername = process.env.ADMIN_USERNAME;
    const previousPassword = process.env.ADMIN_PASSWORD;
    const previousTableName = process.env.RSVP_TABLE_NAME;
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD = 'test-password';
    delete process.env.RSVP_TABLE_NAME;
    try {
      const response = await handler({
        rawPath: '/admin/rsvps',
        headers: {},
        requestContext: { http: { method: 'GET' } },
      });
      assert.equal(response.statusCode, 401);

      const authorizedResponse = await handler({
        rawPath: '/admin/rsvps',
        headers: {
          authorization: `Basic ${Buffer.from('admin:test-password').toString('base64')}`,
        },
        requestContext: { http: { method: 'GET' } },
      });
      assert.equal(authorizedResponse.statusCode, 500);
      assert.match(authorizedResponse.body, /RSVP service is not configured/);
    } finally {
      if (previousUsername === undefined) delete process.env.ADMIN_USERNAME;
      else process.env.ADMIN_USERNAME = previousUsername;
      if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD;
      else process.env.ADMIN_PASSWORD = previousPassword;
      if (previousTableName === undefined) delete process.env.RSVP_TABLE_NAME;
      else process.env.RSVP_TABLE_NAME = previousTableName;
    }
  });
});
