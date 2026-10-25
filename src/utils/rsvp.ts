import { RsvpResponse } from '../types';

export const buildRsvpSubmissionPayload = (formData: RsvpResponse) => ({
  ...formData,
});

export const submitRsvpToEndpoint = async (url: string, payload: Record<string, unknown>) => {
  if (!url) {
    throw new Error('RSVP API URL is not configured');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`RSVP submission failed with status ${response.status}`);
  }

  return { ok: true };
};
