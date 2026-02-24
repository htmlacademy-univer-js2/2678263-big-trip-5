import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../constants.js';

const EmptyMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function createEmptyTemplate(filterType) {
  const message = EmptyMessage[filterType] || EmptyMessage[FilterType.EVERYTHING];
  return `<p class="trip-events__trip-message trip-events__message">${message}</p>`;
}

export default class EmptyView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyTemplate(this.#filterType);
  }
}
