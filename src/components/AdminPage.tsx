import React, { useState } from 'react';
import { LockKeyhole, LogOut, RefreshCw } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import { PersonalRsvpQrCode } from './PersonalRsvpQrCode';

interface AdminRsvp {
  displayName: string;
  shareToken: string;
  internalName: string;
  phone: string;
  email: string;
  side: 'bride' | 'groom' | 'unassigned';
  grahShantiAttending: boolean;
  grahShantiPeople: number;
  pithiAttending: boolean;
  pithiPeople: number;
  weddingAttending: boolean;
  weddingPeople: number;
  updatedAt: string;
}

type SeedEventKey = 'grahShanti' | 'pithi' | 'wedding';
type SeedRsvpForm = {
  displayName: string;
  internalName: string;
  phone: string;
  email: string;
  side: 'bride' | 'groom';
  grahShantiAttending: boolean;
  grahShantiPeople: number;
  pithiAttending: boolean;
  pithiPeople: number;
  weddingAttending: boolean;
  weddingPeople: number;
};

const apiUrl = import.meta.env.VITE_RSVP_API_URL;
const usPhonePattern = /^(?:\+?1[ .-]?)?(?:\([2-9](?!11)[0-9]{2}\)|[2-9](?!11)[0-9]{2})[ .-]?[2-9](?!11)[0-9]{2}[ .-]?[0-9]{4}$/;
const isValidUsPhone = (phone: string) => phone.trim() === '' || usPhonePattern.test(phone.trim());
const getPersonalRsvpPath = (token: string) => token.length === 10
  ? `/rsvp/guest/${token}`
  : `/rsvp/${token}`;
const initialSeedForm: SeedRsvpForm = {
  displayName: '',
  internalName: '',
  phone: '',
  email: '',
  side: 'bride',
  grahShantiAttending: false,
  grahShantiPeople: 1,
  pithiAttending: false,
  pithiPeople: 1,
  weddingAttending: false,
  weddingPeople: 1,
};

const encodeBasicAuth = (username: string, password: string) => {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
};

export const AdminPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authorization, setAuthorization] = useState('');
  const [rsvps, setRsvps] = useState<AdminRsvp[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seedForm, setSeedForm] = useState<SeedRsvpForm>(initialSeedForm);
  const [seedMessage, setSeedMessage] = useState('');
  const [linkMessage, setLinkMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const loadRsvps = async (credential: string) => {
    setLoading(true);
    setError('');
    try {
      if (!apiUrl) throw new Error('RSVP service is not configured.');
      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/admin/rsvps`, {
        headers: { Authorization: credential },
      });
      if (response.status === 401) throw new Error('Incorrect username or password.');
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Could not load RSVPs.');
      }
      const result = await response.json() as { rsvps: AdminRsvp[] };
      setRsvps(result.rsvps);
      setAuthorization(credential);
      setUsername('');
      setPassword('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load RSVPs.');
    } finally {
      setLoading(false);
    }
  };

  const submitCredentials = (event: React.FormEvent) => {
    event.preventDefault();
    void loadRsvps(`Basic ${encodeBasicAuth(username, password)}`);
  };

  const signOut = () => {
    setAuthorization('');
    setRsvps(null);
    setUsername('');
    setPassword('');
    setSeedForm(initialSeedForm);
    setSeedMessage('');
    setLinkMessage('');
  };

  const shortenRsvpLink = async (token: string) => {
    setError('');
    setLinkMessage('');
    setLoading(true);
    try {
      if (!apiUrl) throw new Error('RSVP service is not configured.');
      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/admin/rsvps/${encodeURIComponent(token)}/short-link`, {
        method: 'POST',
        headers: { Authorization: authorization },
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Could not create a shorter RSVP link.');
      }
      setLinkMessage('A shorter personal RSVP link is ready.');
      await loadRsvps(authorization);
    } catch (shortenError) {
      setError(shortenError instanceof Error ? shortenError.message : 'Could not create a shorter RSVP link.');
    } finally {
      setLoading(false);
    }
  };

  const submitSeed = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSeedMessage('');
    if (!isValidUsPhone(seedForm.phone)) {
      setPhoneError('Enter a valid 10-digit U.S. phone number.');
      return;
    }
    setLoading(true);
    try {
      if (!apiUrl) throw new Error('RSVP service is not configured.');
      const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/admin/rsvps`, {
        method: 'POST',
        headers: { Authorization: authorization, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...seedForm,
          grahShantiPeople: seedForm.grahShantiAttending ? seedForm.grahShantiPeople : 0,
          pithiPeople: seedForm.pithiAttending ? seedForm.pithiPeople : 0,
          weddingPeople: seedForm.weddingAttending ? seedForm.weddingPeople : 0,
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Could not add the internal RSVP.');
      }
      setSeedForm(initialSeedForm);
      setPhoneError('');
      setSeedMessage('Internal RSVP added.');
      await loadRsvps(authorization);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not add the internal RSVP.');
    } finally {
      setLoading(false);
    }
  };

  const renderSeedEvent = (key: SeedEventKey, title: string) => {
    const attendingKey = `${key}Attending` as const;
    const peopleKey = `${key}People` as const;
    const attending = seedForm[attendingKey];
    return (
      <fieldset key={key} className="rounded-lg border border-[#493A36]/15 p-3">
        <legend className="px-1 text-sm font-semibold">{title}</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={attending}
            onChange={(change) => setSeedForm((current) => ({ ...current, [attendingKey]: change.target.checked }))}
            className="h-4 w-4 accent-[#A52A3A]"
          />
          Attending
        </label>
        {attending && (
          <label className="mt-2 block text-sm">
            People (including yourself)
            <input
              type="number"
              min="1"
              step="1"
              required
              value={seedForm[peopleKey]}
              onChange={(change) => setSeedForm((current) => ({ ...current, [peopleKey]: Number(change.target.value) }))}
              className="mt-1 block w-full rounded-lg border border-[#493A36]/20 px-3 py-2"
            />
          </label>
        )}
      </fieldset>
    );
  };

  return (
    <main className="min-h-screen bg-[#FBF7ED] px-4 py-10 text-[#493A36] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#A52A3A]">
          <GaneshIcon className="h-6 w-6" />
          Neh &amp; Fenny
        </a>
        <section className="rounded-2xl border-2 border-[#92916F]/40 bg-white/70 p-6 shadow-xl sm:p-10">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A52A3A]">Private admin</p>
              <h1 className="mt-1 font-serif-display text-3xl font-bold sm:text-4xl">Wedding RSVPs</h1>
            </div>
            {authorization && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void loadRsvps(authorization)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#493A36]/20 px-4 py-2 text-sm hover:bg-[#FBF7ED] disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#493A36]/20 px-4 py-2 text-sm hover:bg-[#FBF7ED]"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </header>
          {!authorization && (
            <form onSubmit={submitCredentials} className="mx-auto max-w-md space-y-4">
              <label className="block text-sm font-medium">
                Username
                <input
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2.5"
                />
              </label>
              <label className="block text-sm font-medium">
                Password
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2.5"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#A52A3A] px-5 py-3 text-sm font-bold text-white hover:bg-[#871F30] disabled:opacity-60"
              >
                <LockKeyhole className="h-4 w-4" />
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}
          {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {linkMessage && <p role="status" className="mt-5 text-sm text-emerald-800">{linkMessage}</p>}
          {authorization && rsvps && (
            <>
            <form onSubmit={submitSeed} className="mb-8 rounded-xl border border-[#92916F]/40 bg-[#FBF7ED] p-5">
              <h2 className="mb-4 font-serif-display text-2xl font-bold">Add an internal RSVP</h2>
              <p className="mb-4 text-sm text-stone-600">For seeded records only. Internal name is private and can be used instead of the display name for your own reference.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Display name
                  <input
                    required
                    maxLength={100}
                    value={seedForm.displayName}
                    onChange={(event) => setSeedForm((current) => ({ ...current, displayName: event.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Internal name (optional)
                  <input
                    maxLength={100}
                    value={seedForm.internalName}
                    onChange={(event) => setSeedForm((current) => ({ ...current, internalName: event.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Phone number (optional)
                  <input
                    type="tel"
                    maxLength={40}
                    autoComplete="tel"
                    pattern={usPhonePattern.source}
                    placeholder="(212) 555-1234"
                    title="Enter a valid 10-digit U.S. phone number."
                    value={seedForm.phone}
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? 'seed-phone-error' : 'seed-phone-help'}
                    onChange={(event) => {
                      const phone = event.target.value;
                      setSeedForm((current) => ({ ...current, phone }));
                      setPhoneError(phone.trim() && !isValidUsPhone(phone)
                        ? 'Enter a valid 10-digit U.S. phone number.'
                        : '');
                    }}
                    className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2"
                  />
                  {phoneError
                    ? <span id="seed-phone-error" role="alert" className="mt-1 block text-xs font-normal text-red-800">{phoneError}</span>
                    : <span id="seed-phone-help" className="mt-1 block text-xs font-normal text-stone-500">Enter a valid 10-digit U.S. phone number.</span>}
                </label>
                <label className="block text-sm font-medium">
                  Email (optional)
                  <input
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={seedForm.email}
                    onChange={(event) => setSeedForm((current) => ({ ...current, email: event.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  Side
                  <select
                    value={seedForm.side}
                    onChange={(event) => setSeedForm((current) => ({
                      ...current,
                      side: event.target.value === 'groom' ? 'groom' : 'bride',
                    }))}
                    className="mt-1 block w-full rounded-lg border border-[#493A36]/20 bg-white px-3 py-2"
                  >
                    <option value="bride">Bride's side</option>
                    <option value="groom">Groom's side</option>
                  </select>
                </label>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {renderSeedEvent('grahShanti', 'Grah Shanti')}
                {renderSeedEvent('pithi', 'Haldi')}
                {renderSeedEvent('wedding', 'Wedding')}
              </div>
              {seedMessage && <p role="status" className="mt-3 text-sm text-emerald-800">{seedMessage}</p>}
              <button
                type="submit"
                disabled={loading || !isValidUsPhone(seedForm.phone)}
                className="mt-4 rounded-lg bg-[#A52A3A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#871F30] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add seeded RSVP
              </button>
            </form>
            <div className="overflow-x-auto">
              <p className="mb-4 text-sm text-stone-600">{rsvps.length} new-format RSVP{rsvps.length === 1 ? '' : 's'}</p>
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#493A36]/20 text-xs uppercase tracking-wider text-stone-600">
                    <th className="px-3 py-3">Display / internal name</th>
                    <th className="px-3 py-3">RSVP link</th>
                    <th className="px-3 py-3">QR code</th>
                    <th className="px-3 py-3">Phone</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Side</th>
                    <th className="px-3 py-3">Grah Shanti</th>
                    <th className="px-3 py-3">Haldi</th>
                    <th className="px-3 py-3">Wedding</th>
                    <th className="px-3 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp, index) => (
                    <tr key={`${rsvp.displayName}-${rsvp.updatedAt}-${index}`} className="border-b border-[#493A36]/10">
                      <td className="px-3 py-4 font-semibold">
                        {rsvp.displayName}
                        {rsvp.internalName && <span className="block text-xs font-normal text-stone-500">Internal: {rsvp.internalName}</span>}
                      </td>
                      <td className="max-w-[240px] px-3 py-4">
                        {rsvp.shareToken ? (
                          <>
                            <a
                              href={`${window.location.origin}${getPersonalRsvpPath(rsvp.shareToken)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-[#A52A3A] underline"
                            >
                              {`${window.location.origin}${getPersonalRsvpPath(rsvp.shareToken)}`}
                            </a>
                            {rsvp.shareToken.length === 64 && (
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => void shortenRsvpLink(rsvp.shareToken)}
                                className="mt-2 block text-xs font-semibold text-[#A52A3A] underline disabled:opacity-60"
                              >
                                Create shorter 10-character link
                              </button>
                            )}
                          </>
                        ) : 'Not available'}
                      </td>
                      <td className="px-3 py-4">
                        {rsvp.shareToken
                          ? <div className="w-24"><PersonalRsvpQrCode url={`${window.location.origin}${getPersonalRsvpPath(rsvp.shareToken)}`} size={96} /></div>
                          : 'Not available'}
                      </td>
                      <td className="px-3 py-4">{rsvp.phone || '—'}</td>
                      <td className="px-3 py-4">{rsvp.email || '—'}</td>
                      <td className="px-3 py-4">{rsvp.side === 'bride' ? "Bride's side" : rsvp.side === 'groom' ? "Groom's side" : 'Not assigned'}</td>
                      <td className="px-3 py-4">{rsvp.grahShantiAttending ? rsvp.grahShantiPeople : 0}</td>
                      <td className="px-3 py-4">{rsvp.pithiAttending ? rsvp.pithiPeople : 0}</td>
                      <td className="px-3 py-4">{rsvp.weddingAttending ? rsvp.weddingPeople : 0}</td>
                      <td className="px-3 py-4 text-stone-600">{new Date(rsvp.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rsvps.length === 0 && <p className="py-8 text-center text-sm text-stone-600">No new-format RSVPs have been submitted yet.</p>}
            </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};
