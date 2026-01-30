import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import PointsModel from '../model/points-model.js';

import { render } from '../framework/render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointListComponent = new PointListView();

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

  #renderPoint(enrichedPoint) {
    render(
      new PointView({ point: enrichedPoint }),
      this.#pointListComponent.element,
    );
  }
}
