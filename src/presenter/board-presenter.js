import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import PointsModel from '../model/points-model.js';

import { render, replace } from '../framework/render.js';

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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
      }
    };

    const handleRollupClick = () => {
      replaceFormToCard();
    };

    const handleEditClick = () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const handleFormSubmit = () => {
      replaceFormToCard();
    };

    const pointComponent = new PointView({
      point: enrichedPoint,
      onEditClick: handleEditClick,
    });

    const pointEditComponent = new EditPointView({
      point: enrichedPoint,
      onFormSubmit: handleFormSubmit,
      onRollupClick: handleRollupClick,
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#pointListComponent.element);
  }
}
