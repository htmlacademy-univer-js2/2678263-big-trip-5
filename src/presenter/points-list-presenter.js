import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointPresenter from './point-presenter.js';
import { SORT_FUNCTIONS } from '../utils/sort.js';
import { SortType, FilterType } from '../constants.js';
import EmptyView from '../view/empty-view.js';

import { render, remove, RenderPosition } from '../framework/render.js';

export default class PointsListPresenter {
  #listContainer = null;
  #destinations = [];
  #points = [];
  #sourcedPoints = [];
  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;
  #emptyComponent = null;

  #pointListComponent = new PointListView();
  #sortComponent = null;
  #pointPresenters = new Map();

  #onPointChange = null;
  #onModeChange = null;
  #getOffersByType = null;
  #getDestinationById = null;
  #getDescriptionById = null;

  constructor({
    listContainer,
    destinations,
    onPointChange,
    onModeChange,
    getOffersByType,
    getDestinationById,
    getDescriptionById,
    handleViewAction,
    filterType,
  }) {
    this.#listContainer = listContainer;
    this.#destinations = destinations;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
    this.#getOffersByType = getOffersByType;
    this.#getDestinationById = getDestinationById;
    this.#getDescriptionById = getDescriptionById;
    this.#handleViewAction = handleViewAction;
    this.#currentFilterType = filterType ?? FilterType.EVERYTHING;
  }

  init(points, filterType = FilterType.EVERYTHING) {
    this.#points = points;
    this.#sourcedPoints = [...points];
    this.#currentSortType = SortType.DAY;
    this.#currentFilterType = filterType;

    this.#points.sort(SORT_FUNCTIONS[this.#currentSortType]);
    this.#renderSort();
    render(this.#pointListComponent, this.#listContainer);
    this.#renderPoints();
  }

  setFilter(filterType) {
    this.#currentFilterType = filterType;
    this.#currentSortType = SortType.DAY;
    this.init(this.#points, filterType);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#onModeChange();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#points.sort(SORT_FUNCTIONS[sortType]);
    this.#clearPointList();
    this.#renderPoints();
  };

  updatePointById(updatedPoint) {
    const existingPresenter = this.#pointPresenters.get(updatedPoint.id);
    if (!existingPresenter) {
      return;
    }
    if (existingPresenter) {
      existingPresenter.update(updatedPoint);
    }
  }

  clearAndReRenderPoints() {
    this.#clearPointList();
    this.#renderPoints();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      destinations: this.#destinations,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
      getOffersByType: (type) => this.#getOffersByType(type),
      getDestinationById: (id) => this.#getDestinationById(id),
      getDescriptionById: (id) => this.#getDescriptionById(id),
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    if (this.#points.length === 0) {
      this.#emptyComponent = new EmptyView({
        filterType: this.#currentFilterType,
      });
      render(this.#emptyComponent, this.#listContainer);
      return;
    }
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      this.#emptyComponent = null;
    }

    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
    this.#pointListComponent.element.innerHTML = '';
  }

  destroy() {
    this.#clearPointList();
    remove(this.#sortComponent);
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      this.#emptyComponent = null;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    this.#handleViewAction(actionType, updateType, update);
  };
}
