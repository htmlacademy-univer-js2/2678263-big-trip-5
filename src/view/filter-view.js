import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters, currentFilter) {
  if (!filters) {
    return '';
  }

  const filtersHtml = filters.map(({ type }) => {
    const isChecked = type === currentFilter ? 'checked' : '';

    return `
      <div class="trip-filters__filter">
        <input
          id="filter-${type}"
          class="trip-filters__filter-input visually-hidden"
          type="radio"
          name="trip-filter"
          value="${type}"
          data-filter-type="${type}"
          ${isChecked}
        >
        <label class="trip-filters__filter-label" for="filter-${type}">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      </div>
    `;
  }).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersHtml}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilter, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    const filterType = evt.target.dataset.filterType;
    if (this.#handleFilterTypeChange) {
      this.#handleFilterTypeChange(filterType);
    }
  };
}
