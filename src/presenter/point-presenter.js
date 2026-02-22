import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { Mode, UpdateType, UserAction } from '../constants.js';

import { render, remove, replace } from '../framework/render.js';

export default class PointPresenter {
  #pointListContainer = null;
  #handleModeChange = null;
  #handleDataChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;
  #destinations = [];

  #getOffersByType = null;

  constructor({
    pointListContainer,
    destinations,
    onModeChange,
    onDataChange,
    getOffersByType,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#destinations = destinations;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
    this.#getOffersByType = getOffersByType;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onRollupClick: this.#handleRollupClick,
      onTypeChange: this.#handleTypeChange,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    requestAnimationFrame(() => {
      this.#pointEditComponent.initDatePickers();
    });
    remove(prevPointComponent);
    remove(prevPointEditComponent);

    if (this.#pointComponent && this.#pointEditComponent) {
      this.#pointComponent.update(point);
      this.#pointEditComponent.update(point);
    }
  }

  update(updatedPoint) {
    this.#point = updatedPoint;
    if (typeof this.#pointComponent?.update === 'function') {
      this.#pointComponent.update(updatedPoint);
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#pointEditComponent.initDatePickers();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    this.#pointEditComponent.reset();
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleRollupClick = () => {
    this.#replaceFormToCard();
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = () => {
    this.#handleDataChange(this.#point);
    this.destroy();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleTypeChange = (type) => this.#getOffersByType(type).offers;
}
