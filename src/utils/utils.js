import {
  MONTH_NAMES,
  MINUTES_IN_DAY,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
} from '../constants';
export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function updateItem(items, update) {
  return items.map((item) => (item.id === update.id ? update : item));
}

export function getFormatDate(isoString) {
  const parts = isoString.split('T')[0].split('-');
  const month = parts[1];
  const day = parts[2];

  return `${day} ${MONTH_NAMES[Number(month) - 1]}`;
}

export function getFormatTime(isoString) {
  return isoString.split('T')[1].slice(0, 5);
}

export function getDuration(startIso, endIso) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '—';
  }

  const diffMs = end - start;
  if (diffMs <= 0) {
    return '0M';
  }

  const totalMinutes = Math.floor(diffMs / MS_IN_MINUTE);
  const days = Math.floor(totalMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((totalMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

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

  return parts.length > 0 ? parts.join(' ') : '0M';
}

export function getDateAndTimeFromISO(isoString) {
  if (!isoString) {
    return '19/03/19 00:00';
  }
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
