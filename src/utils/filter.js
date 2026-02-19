import dayjs from 'dayjs';
import { FilterType } from '../constants.js';

const now = dayjs();

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) =>
    points.filter((point) => dayjs(point.dateFrom).isAfter(now)),

  [FilterType.PRESENT]: (points) =>
    points.filter(
      (point) =>
        dayjs(point.dateFrom).isBefore(now) && dayjs(point.dateTo).isAfter(now),
    ),

  [FilterType.PAST]: (points) =>
    points.filter((point) => dayjs(point.dateTo).isBefore(now)),
};
