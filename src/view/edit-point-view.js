import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateAndTimeFromISO } from '../utils/utils.js';

function editPointTemplate(point) {
  const {
    type = 'flight',
    destinationName = 'Unknown',
    dateFrom,
    dateTo,
    basePrice = '',
    resolvedOffers = [],
    destinationDescription = '-',
  } = point || {};

  const timeFrom = getDateAndTimeFromISO(dateFrom);
  const timeTo = getDateAndTimeFromISO(dateTo);

  const offerSelectors = resolvedOffers
    .map(
      (offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${offer.id}"
             type="checkbox"
             name="event-offer-${offer.id}"
             ${offer.isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `,
    )
    .join('');

  const typeIcon = `img/icons/${type.toLowerCase()}.png`;
  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${typeIcon}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
                            <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <!-- Все типы с динамическим checked -->
                ${[
    'taxi',
    'bus',
    'train',
    'ship',
    'drive',
    'flight',
    'check-in',
    'sightseeing',
    'restaurant',
  ]
    .map(
      (eventType) => `
                    <div class="event__type-item">
                      <input
                        id="event-type-${eventType}-1"
                        class="event__type-input visually-hidden"
                        type="radio"
                        name="event-type"
                        value="${eventType}"
                        ${type === eventType ? 'checked' : ''}
                      >
                      <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-1">
                        ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                      </label>
                    </div>
                  `,
    )
    .join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destinationName} list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${timeFrom}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${timeTo}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice || ''}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offerSelectors}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationDescription}</p>
          </section>
        </section>
    </form>
     </li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleRollupClick = null;

  constructor({ point, onFormSubmit, onRollupClick }) {
    super();
    console.log('Создание EditPointView', { point });
    this._setState(EditPointView.parsePointToState(point));
    console.log('Состояние установлено:', this._state);
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this._restoreHandlers();
  }

  get template() {
    return editPointTemplate(this._state);
  }

  _restoreHandlers() {
    console.log('Восстановление обработчиков');
    const form = this.element.querySelector('form');

    form.addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    form.addEventListener('change', this.#typeChangeHandler);
    form.addEventListener('change', this.#offersChangeHandler);
    form.addEventListener('input', this.#inputChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    console.log('Сабмит формы, состояние:', this._state);
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__type-input')) {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__offer-checkbox')) {
      const offerId = evt.target.id.replace('event-offer-', '');
      const isChecked = evt.target.checked;

      const updatedOffers = this._state.resolvedOffers.map((offer) =>
        offer.id === offerId ? { ...offer, isChecked } : offer,
      );

      this.updateElement({
        resolvedOffers: updatedOffers,
      });
    }
  };

  #inputChangeHandler = (evt) => {
    const target = evt.target;

    switch (target.name) {
      case 'event-destination':
        this.updateElement({
          destinationName: target.value,
        });
        break;
      case 'event-start-time':
        this.updateElement({
          timeFrom: target.value,
        });
        break;
      case 'event-end-time':
        this.updateElement({
          timeTo: target.value,
        });
        break;
      case 'event-price':
        this.updateElement({
          basePrice: target.value,
        });
        break;
    }
  };

  static parsePointToState(point) {
    return {
      ...point,
      resolvedOffers: (point.resolvedOffers || []).map((offer) => ({
        ...offer,
        isChecked: offer.isChecked !== undefined ? offer.isChecked : true,
      })),
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    if (point.resolvedOffers) {
      point.resolvedOffers = point.resolvedOffers.map((offer) => {
        const { ...offerData } = offer;
        return offerData;
      });
    }
    console.log('parsePointToState:', {
      вход: state,
      выход: point,
    });
    return point;
  }
}
