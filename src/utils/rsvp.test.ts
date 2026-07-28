import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildRsvpSubmissionPayload } from './rsvp';

describe('buildRsvpSubmissionPayload', () => {
  it('includes the guest details and source metadata', () => {
    const payload = buildRsvpSubmissionPayload({
      guestName: 'Neh & Fenny',
      email: 'guest@example.com',
      attendingDay1: true,
      attendingDay2: false,
      dietaryRestrictions: 'Vegetarian',
      guestCount: 2,
      messageToCouple: 'Excited to celebrate!'
    });

    assert.equal(payload.guestName, 'Neh & Fenny');
    assert.equal(payload.email, 'guest@example.com');
    assert.equal(payload.attendingDay1, true);
    assert.equal(payload.attendingDay2, false);
    assert.equal(payload.dietaryRestrictions, 'Vegetarian');
    assert.equal(payload.guestCount, 2);
    assert.equal(payload.messageToCouple, 'Excited to celebrate!');
    assert.equal(payload.source, 'wedding-site');
    assert.equal(typeof payload.timestamp, 'string');
  });
});
