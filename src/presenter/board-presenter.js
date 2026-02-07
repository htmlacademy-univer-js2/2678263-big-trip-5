import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointsModel from '../model/points-model.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';

import { render } from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointListComponent = new PointListView();
  #sortComponent = new SortView();

  #boardPoints = [];
  #pointPresenters = new Map();

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    render(this.#sortComponent, this.#boardContainer);
    render(this.#pointListComponent, this.#boardContainer);

    const enrichedPoints = this.#pointsModel.getEnrichedPoints();
    enrichedPoints.forEach((enrichedPoint) => {
      this.#renderPoint(enrichedPoint);
    });
  }

  #handleTaskChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(enrichedPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleTaskChange
    });
    pointPresenter.init(enrichedPoint);
    this.#pointPresenters.set(enrichedPoint.id, pointPresenter);
  }
}
