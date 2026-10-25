import React, { useEffect, useState } from 'react';
import { CheckCircle2, Heart, LoaderCircle, Send } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';

interface Invitation {
  familyName: string;
  members: Array<{ id: string; name: string }>;
  attendingDay1: string[];
  attendingDay2: string[];
}

interface RsvpPageProps {
  token: string;
}

const apiUrl = import.meta.env.VITE_RSVP_API_URL;

export const RsvpPage: React.FC<RsvpPageProps> = ({ token }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [day1, setDay1] = useState<string[]>([]);
  const [day2, setDay2] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadInvitation = async () => {
      try {
        if (!apiUrl) throw new Error('RSVP service is not configured.');
        const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/rsvp/${encodeURIComponent(token)}`);
        if (!response.ok) throw new Error(response.status === 404 ? 'This invitation link is invalid.' : 'Could not load this invitation.');
        const data = await response.json() as Invitation;
        if (!active) return;
        setInvitation(data);
        setDay1(data.attendingDay1);
        setDay2(data.attendingDay2);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Could not load this invitation.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadInvitation();
    return () => { active = false; };
  }, [token]);

  const toggleMember = (event: 'day1' | 'day2', memberId: string) => {
    const update = event === 'day1' ? setDay1 : setDay2;
    const selected = event === 'day1' ? day1 : day2;
    update(selected.includes(memberId)
      ? selected.filter((id) => id !== memberId)
      : [...selected, memberId]);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/rsvp/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendingDay1: day1, attendingDay2: day2 }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Could not save your RSVP.');
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save your RSVP.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderEvent = (
    title: string,
    date: string,
    selected: string[],
    event: 'day1' | 'day2',
  ) => (
    <fieldset className="rounded-xl border border-[#2D2424]/15 p-4">
      <legend className="px-2 font-serif-display text-xl font-bold">{title}</legend>
      <p className="mb-3 text-xs text-stone-500">{date}</p>
      <div className="space-y-2">
        {invitation?.members.map((member) => (
          <label key={member.id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(member.id)}
              onChange={() => toggleMember(event, member.id)}
              className="h-4 w-4 accent-[#990000]"
            />
            <span>{member.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 py-12 text-[#2D2424] sm:py-20">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#990000]">
          <GaneshIcon className="h-6 w-6" />
          Neh &amp; Fenny
        </a>
        <section className="rounded-2xl border-2 border-[#D4AF37]/40 bg-[#FAF9F6] p-6 shadow-xl sm:p-10">
          <header className="mb-6 text-center">
            <Heart className="mx-auto mb-3 h-7 w-7 fill-[#990000] text-[#990000]" />
            <h1 className="font-serif-display text-3xl font-bold sm:text-4xl">Wedding RSVP</h1>
            {invitation && <p className="mt-2 text-stone-600">{invitation.familyName}</p>}
          </header>

          {loading ? (
            <p className="flex items-center justify-center gap-2 py-10 text-sm text-stone-600">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading your invitation...
            </p>
          ) : error && !invitation ? (
            <p role="alert" className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-800">{error}</p>
          ) : submitted ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-700" />
              <h2 className="font-serif-display text-2xl font-bold">Thank you!</h2>
              <p className="mt-2 text-sm text-stone-600">
                Your RSVP has been saved. You can return to this private link anytime to view or edit your reservation.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-5 rounded-lg border border-[#990000] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#990000] transition-colors hover:bg-[#990000]/5"
              >
                Edit reservation
              </button>
            </div>
          ) : invitation ? (
            <form onSubmit={submit} className="space-y-5">
              <p className="text-center text-sm text-stone-600">
                Select who is attending each event. Everyone on your invitation is selected by default.
              </p>
              {renderEvent('Day 1: Grah Shanti & Pithi', 'Saturday, November 14, 2026', day1, 'day1')}
              {renderEvent('Day 2: Wedding & Reception', 'Sunday, November 15, 2026', day2, 'day2')}
              {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#990000] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-colors hover:bg-[#770000] disabled:cursor-wait disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? 'Saving RSVP...' : 'Save RSVP'}
              </button>
            </form>
          ) : null}
        </section>
      </div>
    </main>
  );
};
