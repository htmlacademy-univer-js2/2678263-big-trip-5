import dayjs from 'dayjs';
import { SortType } from '../constants.js';

function getWeightForNullValue(valueA, valueB) {
  if (valueA === null && valueB === null) {
    return 0;
  }
  if (valueA === null || valueA === undefined) {
    return 1;
  }
  if (valueB === null || valueB === undefined) {
    return -1;
  }
  return null;
}

export function sortPointByDay(pointA, pointB) {
  const weight = getWeightForNullValue(pointA.dateFrom, pointB.dateFrom);
  if (weight !== null) {
    return weight;
  }
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

export function sortPointByTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationA - durationB;
}

export function sortPointByPrice(pointA, pointB) {
  const weight = getWeightForNullValue(pointA.basePrice, pointB.basePrice);
  if (weight !== null) {
    return weight;
  }
  return pointA.basePrice - pointB.basePrice;
}

export const SORT_FUNCTIONS = {
  [SortType.DAY]: sortPointByDay,
  [SortType.TIME]: sortPointByTime,
  [SortType.PRICE]: sortPointByPrice
};
