import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { handler, validateRsvp } from './index.mjs';

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

describe('handler', () => {
  it('rejects paths that do not contain a full opaque invitation token', async () => {
    const response = await handler({
      rawPath: '/rsvp/not-a-token',
      requestContext: { http: { method: 'GET' } },
    });
    assert.equal(response.statusCode, 404);
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
});
