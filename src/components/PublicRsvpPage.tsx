import React, { useEffect, useState } from 'react';
import { CheckCircle2, Heart, LoaderCircle, Send } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import { rsvpEvents } from '../data/rsvpEvents';
import { PersonalRsvpQrCode } from './PersonalRsvpQrCode';

type EventKey = 'grahShanti' | 'pithi' | 'wedding';
type EventResponse = { attending: boolean; people: number };
type RsvpForm = {
  displayName: string;
  grahShanti: EventResponse;
  pithi: EventResponse;
  wedding: EventResponse;
};

const apiUrl = import.meta.env.VITE_RSVP_API_URL;
const initialForm: RsvpForm = {
  displayName: '',
  grahShanti: { attending: false, people: 1 },
  pithi: { attending: false, people: 1 },
  wedding: { attending: false, people: 1 },
};

interface PublicRsvpPageProps {
  token?: string;
}

export const PublicRsvpPage: React.FC<PublicRsvpPageProps> = ({ token: initialToken }) => {
  const [form, setForm] = useState<RsvpForm>(initialForm);
  const [rsvpToken, setRsvpToken] = useState(initialToken ?? '');
  const [loading, setLoading] = useState(Boolean(initialToken));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialToken) return;
    let active = true;
    const loadRsvp = async () => {
      try {
        if (!apiUrl) throw new Error('RSVP service is not configured.');
        const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/rsvp/${encodeURIComponent(initialToken)}`);
        if (!response.ok) {
          const result = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(result?.error ?? 'Could not load this RSVP link.');
        }
        const result = await response.json() as {
          displayName: string;
          grahShantiAttending: boolean;
          grahShantiPeople: number;
          pithiAttending: boolean;
          pithiPeople: number;
          weddingAttending: boolean;
          weddingPeople: number;
        };
        if (!active) return;
        setForm({
          displayName: result.displayName,
          grahShanti: { attending: result.grahShantiAttending, people: result.grahShantiPeople || 1 },
          pithi: { attending: result.pithiAttending, people: result.pithiPeople || 1 },
          wedding: { attending: result.weddingAttending, people: result.weddingPeople || 1 },
        });
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load this RSVP link.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadRsvp();
    return () => { active = false; };
  }, [initialToken]);

  const updateEvent = (key: EventKey, update: Partial<EventResponse>) => {
    setForm((current) => ({ ...current, [key]: { ...current[key], ...update } }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!apiUrl) throw new Error('RSVP service is not configured.');
      const endpoint = rsvpToken
        ? `${apiUrl.replace(/\/+$/, '')}/rsvp/${encodeURIComponent(rsvpToken)}`
        : `${apiUrl.replace(/\/+$/, '')}/rsvp`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: form.displayName,
          grahShantiAttending: form.grahShanti.attending,
          grahShantiPeople: form.grahShanti.attending ? form.grahShanti.people : 0,
          pithiAttending: form.pithi.attending,
          pithiPeople: form.pithi.attending ? form.pithi.people : 0,
          weddingAttending: form.wedding.attending,
          weddingPeople: form.wedding.attending ? form.wedding.people : 0,
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Could not save your RSVP.');
      }
      const result = await response.json() as { token?: string };
      if (result.token) setRsvpToken(result.token);
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save your RSVP.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderEvent = (key: EventKey, title: string) => {
    const response = form[key];
    return (
      <fieldset key={key} className="rounded-xl border border-[#493A36]/15 p-4">
        <legend className="px-2">
          <span className="font-serif-display text-2xl font-bold">{title}</span>
        </legend>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#FFFDF7] px-3 py-3 text-base">
          <input
            type="checkbox"
            checked={response.attending}
            onChange={(change) => updateEvent(key, { attending: change.target.checked })}
            className="h-4 w-4 accent-[#A52A3A]"
          />
          <span>Yes, I/we will attend</span>
        </label>
        {response.attending && (
          <label className="mt-3 block text-base font-medium">
            How many people?
            <input
              type="number"
              min="1"
              step="1"
              required
              value={response.people}
              onChange={(change) => updateEvent(key, { people: Number(change.target.value) })}
              className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2"
            />
            <span className="mt-1 block text-sm font-normal text-stone-500">Please include yourself.</span>
          </label>
        )}
      </fieldset>
    );
  };

  return (
    <main className="min-h-screen bg-[#FBF7ED] px-4 py-12 text-[#493A36] sm:py-20">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#A52A3A]">
          <GaneshIcon className="h-6 w-6" />
          Neh &amp; Fenny
        </a>
        <section className="rounded-2xl border-2 border-[#92916F]/40 bg-[#FBF7ED] p-6 shadow-xl sm:p-10">
          <header className="mb-6 text-center">
            <Heart className="mx-auto mb-3 h-7 w-7 fill-[#A52A3A] text-[#A52A3A]" />
            <h1 className="font-serif-display text-3xl font-bold sm:text-4xl">Wedding RSVP</h1>
          </header>
          {loading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-stone-600">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading your RSVP...
            </p>
          ) : submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-700" />
              <h2 className="font-serif-display text-2xl font-bold">Thank you!</h2>
              <p className="mt-2 text-sm text-stone-600">Your RSVP has been saved.</p>
              {rsvpToken && (
                <div className="mx-auto mt-5 max-w-lg rounded-lg bg-white p-4 text-left">
                  <p className="text-sm font-semibold">Your personal RSVP link</p>
                  <a
                    href={`${window.location.origin}/rsvp/${rsvpToken}`}
                    className="mt-1 block break-all text-sm text-[#A52A3A] underline"
                  >
                    {`${window.location.origin}/rsvp/${rsvpToken}`}
                  </a>
                  <p className="mt-2 text-xs text-stone-500">Keep this link to update your RSVP later.</p>
                  <div className="mt-4 flex justify-center">
                    <PersonalRsvpQrCode url={`${window.location.origin}/rsvp/${rsvpToken}`} />
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 rounded-lg border border-[#A52A3A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#A52A3A] hover:bg-[#A52A3A]/5"
              >
                Edit RSVP
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <label className="block text-sm font-medium">
                Display name
                <input
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={form.displayName}
                  onChange={(change) => setForm((current) => ({ ...current, displayName: change.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2.5"
                />
              </label>
              <div>
                <h2 className="mb-3 font-serif-display text-2xl font-bold">Day 1</h2>
                <div className="space-y-3">
                  {rsvpEvents.day1.map(({ key, title }) => renderEvent(key, title))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 font-serif-display text-2xl font-bold">Day 2</h2>
                <div className="space-y-3">
                  {rsvpEvents.day2.map(({ key, title }) => renderEvent(key, title))}
                </div>
              </div>
              {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#A52A3A] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-colors hover:bg-[#871F30] disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? 'Saving RSVP...' : 'Save RSVP'}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};
