import { RsvpResponse } from '../types';

export const buildRsvpSubmissionPayload = (formData: RsvpResponse) => ({
  ...formData,
  source: 'wedding-site',
  timestamp: new Date().toISOString(),
});

export const submitRsvpToEndpoint = async (url: string, payload: Record<string, unknown>) => {
  if (!url) {
    return { ok: false, reason: 'missing-url' };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`RSVP submission failed with status ${response.status}`);
  }

  return { ok: true, response };
};
