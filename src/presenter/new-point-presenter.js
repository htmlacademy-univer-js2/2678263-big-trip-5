import EditPointView from '../view/edit-point-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../constants.js';

export default class NewPointPresenter {
  #listContainer = null;
  #pointsModel = null;
  #onDataChange = null;
  #onDestroy = null;
  #addComponent = null;
  #getOffersByType = null;


  constructor({ listContainer, pointsModel, onDataChange, onDestroy, getOffersByType }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
    this.#getOffersByType = getOffersByType;
  }

  init() {
    if (this.#addComponent) {
      return;
    }

    const newPoint = {
      type: 'flight',
      destination: '',
      destinationName: '',
      dateFrom: new Date(),
      dateTo: new Date(Date.now() + 60 * 60 * 1000),
      basePrice: 0,
      isFavorite: false,
      offers: [],
      resolvedOffers: [],
    };

    this.#addComponent = new EditPointView({
      point: newPoint,
      destinations: this.#pointsModel.destinations,
      offersByType: this.#getOffersByType(newPoint.type)?.offers ?? [],
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleCancelClick,
      onRollupClick: this.#handleCancelClick,
      onTypeChange: (type) => this.#pointsModel.getOfferByType(type)?.offers || [],
    });

    render(this.#addComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
    requestAnimationFrame(() => {
      this.#addComponent.initDatePickers?.();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
  }

  #handleFormSubmit = (point) => {
    this.#onDataChange(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  setSaving() {
    this.#addComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#addComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#addComponent.shake(resetFormState);
  }

  destroy() {
    if (this.#addComponent === null) {
      return;
    }

    this.#onDestroy();
    remove(this.#addComponent);
    this.#addComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
