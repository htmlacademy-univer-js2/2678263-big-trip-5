import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointsModel from '../model/points-model.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/utils.js';
import { SORT_FUNCTIONS } from '../utils/sort.js';
import { SortType } from '../constants.js';

import { render, RenderPosition } from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointListComponent = new PointListView();
  #sortComponent = null;

  #boardPoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    this.#boardPoints = this.#pointsModel.getEnrichedPoints();
    this.#sourcedBoardPoints = [...this.#boardPoints];
    this.#boardPoints.sort(SORT_FUNCTIONS.day);

    this.#renderSort();
    render(this.#pointListComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #handleTaskChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(
      this.#sourcedBoardPoints,
      updatedPoint,
    );
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    if (sortType === SortType.DAY) {
      this.#boardPoints = [...this.#sourcedBoardPoints];
    } else {
      this.#boardPoints.sort(SORT_FUNCTIONS[sortType]);
    }
    this.#clearPointList();
    this.#renderPoints();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(
      this.#sortComponent,
      this.#boardContainer,
      RenderPosition.AFTERBEGIN,
    );
  }

  #renderPoint(enrichedPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleTaskChange,
    });
    pointPresenter.init(enrichedPoint);
    this.#pointPresenters.set(enrichedPoint.id, pointPresenter);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });
    this.#pointPresenters.clear();
    this.#pointListComponent.element.innerHTML = '';
  }
}
