import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointsModel from '../model/points-model.js';
import PointPresenter from './point-presenter.js';

import { render } from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointListComponent = new PointListView();
  #sortComponent = new SortView();

  #pointPresenters = new Map();

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.#boardContainer);
    render(this.#pointListComponent, this.#boardContainer);

    const enrichedPoints = this.#pointsModel.getEnrichedPoints();
    enrichedPoints.forEach((enrichedPoint) => {
      this.#renderPoint(enrichedPoint);
    });
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(enrichedPoint) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(enrichedPoint);
    this.#pointPresenters.set(enrichedPoint.id, pointPresenter);
  }
}
