import dayjs from 'dayjs';
import { SortType } from '../constants.js';

export function sortPointByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

export function sortPointByTime(pointA, pointB) {
  const durationA = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  const durationB = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  return durationA - durationB;
}

export function sortPointByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export const SORT_FUNCTIONS = {
  [SortType.DAY]: sortPointByDay,
  [SortType.TIME]: sortPointByTime,
  [SortType.PRICE]: sortPointByPrice,
};
