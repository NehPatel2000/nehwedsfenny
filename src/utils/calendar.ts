export function generateGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  startDateIso: string,
  endDateIso: string
) {
  // Format YYYYMMDDTHHMMSSZ
  const formatIso = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatIso(startDateIso);
  const end = formatIso(endDateIso);

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', title);
  url.searchParams.append('details', details);
  url.searchParams.append('location', location);
  url.searchParams.append('dates', `${start}/${end}`);

  return url.toString();
}

export function downloadIcsFile(
  filename: string,
  title: string,
  description: string,
  location: string,
  startDateIso: string,
  endDateIso: string
) {
  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gujarati Wedding Guest Portal//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${formatDate(startDateIso)}`,
    `DTEND:${formatDate(endDateIso)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
