import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface PersonalRsvpQrCodeProps {
  url: string;
  size?: number;
}

export const PersonalRsvpQrCode: React.FC<PersonalRsvpQrCodeProps> = ({ url, size = 160 }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const token = url.split('/').at(-1) ?? 'link';

  useEffect(() => {
    let active = true;
    setImageUrl('');
    setError('');
    QRCode.toDataURL(url, { width: size, margin: 2, errorCorrectionLevel: 'Q' })
      .then((dataUrl) => {
        if (active) setImageUrl(dataUrl);
      })
      .catch(() => {
        if (active) setError('Could not generate this QR code.');
      });
    return () => { active = false; };
  }, [size, url]);

  if (error) return <p role="alert" className="text-xs text-red-800">{error}</p>;
  if (!imageUrl) return <p className="text-xs text-stone-500">Preparing QR code...</p>;

  return (
    <a
      href={imageUrl}
      download={`rsvp-${token}.png`}
      aria-label="Download personal RSVP QR code"
      title="Download personal RSVP QR code"
    >
      <img src={imageUrl} alt="QR code for personal RSVP link" width={size} height={size} className="h-auto max-w-full" />
      <span className="mt-1 block text-center text-xs text-[#A52A3A] underline">Download QR code</span>
    </a>
  );
};
