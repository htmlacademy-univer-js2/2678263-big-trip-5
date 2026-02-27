import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export function getFormatDate(isoString) {
  if (!isoString) {
    return '';
  }

  return dayjs(isoString).format('DD MMM');
}

export function getDuration(startIso, endIso) {
  if (!startIso || !endIso) {
    return '—';
  }

  const start = dayjs(startIso);
  const end = dayjs(endIso);

  if (!start.isValid() || !end.isValid()) {
    return '—';
  }

  const diff = dayjs.duration(end.diff(start));

  if (diff.asMilliseconds() <= 0) {
    return '0M';
  }

  const days = Math.floor(diff.asDays());
  const hours = diff.hours();
  const minutes = diff.minutes();

  const parts = [];

  if (days > 0) {
    parts.push(`${days}D`);
  }
  if (hours > 0) {
    parts.push(`${hours}H`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}M`);
  }

  return parts.length ? parts.join(' ') : '0M';
}

export function getDateAndTimeFromISO(isoString) {
  if (!isoString) {
    return '"19/03/19 00:00"';
  }

  return `"${dayjs(isoString).format('DD/MM/YY HH:mm')}"`;
}

export function getFormatTime(isoString) {
  if (!isoString) {
    return '';
  }

  return dayjs(isoString).format('HH:mm');
}
