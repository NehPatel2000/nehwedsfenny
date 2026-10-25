import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildRsvpSubmissionPayload, submitRsvpToEndpoint } from './rsvp';

describe('buildRsvpSubmissionPayload', () => {
  it('includes the guest details without client-generated metadata', () => {
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
    assert.deepEqual(payload, {
      guestName: 'Neh & Fenny',
      email: 'guest@example.com',
      attendingDay1: true,
      attendingDay2: false,
      dietaryRestrictions: 'Vegetarian',
      guestCount: 2,
      messageToCouple: 'Excited to celebrate!'
    });
  });

  it('rejects submission when the API URL is not configured', async () => {
    await assert.rejects(
      submitRsvpToEndpoint('', {}),
      { message: 'RSVP API URL is not configured' }
    );
  });
});
