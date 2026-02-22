import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateAndTimeFromISO } from '../utils/utils.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function createDestinationOptions(destinationNames) {
  return destinationNames
    .map((name) => `<option value="${name}"></option>`)
    .join('');
}

function editPointTemplate(point) {
  const {
    type = 'flight',
    destinationName = '',
    dateFrom,
    dateTo,
    basePrice = '',
    resolvedOffers = [],
    destinationDescription = '',
    destinationPictures = [],
  } = point || {};

  const destinationNames = Array.isArray(point.destinations)
    ? point.destinations.map((dest) => dest.name)
    : [];
  const timeFrom = getDateAndTimeFromISO(dateFrom);
  const timeTo = getDateAndTimeFromISO(dateTo);

  const photosHtml = destinationPictures
    .map((picture) => {
      const src = picture.src ? picture.src.trim() : '';
      const alt = picture.description || 'Event photo';
      return `<img class="event__photo" src="${src}" alt="${alt}">`;
    })
    .join('');

  const offerSelectors = resolvedOffers
    .map(
      (offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden"
             id="event-offer-${offer.id}"
             type="checkbox"
             name="event-offer-${offer.id}"
             ${offer.isChecked ? 'checked' : ''}
             data-offerId="${offer.id}">
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
              <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destinationName}"
              placeholder="Choose destination"
              list="destination-list-1"
            >
            <datalist id="destination-list-1">
              ${createDestinationOptions(destinationNames)}
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

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosHtml}
              </div>
            </div>
          </section>
        </section>
    </form>
     </li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handeleDeleteClick = null;
  #handleRollupClick = null;
  #handleTypeChange = null;
  #destinations = [];
  #initialState = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({
    point,
    destinations,
    onFormSubmit,
    onDeleteClick,
    onRollupClick,
    onTypeChange,
  }) {
    super();

    const preparedState = EditPointView.parsePointToState(point);
    this._setState(preparedState);
    this.#initialState = structuredClone(preparedState);

    this._setState(EditPointView.parsePointToState(point));
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handeleDeleteClick = onDeleteClick;
    this.#handleRollupClick = onRollupClick;
    this.#handleTypeChange = onTypeChange;
    this._restoreHandlers();
  }

  get template() {
    const stateWithDestinations = {
      ...this._state,
      destinations: this.#destinations,
    };
    return editPointTemplate(stateWithDestinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    form.addEventListener('submit', this.#formSubmitHandler);
    form.addEventListener('reset', this.#deleteClickHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    const priceInput = this.element.querySelector('#event-price-1');
    if (priceInput) {
      priceInput.addEventListener('input', this.#priceInputHandler);
      priceInput.addEventListener('keydown', this.#priceKeydownHandler);
    }
    form.addEventListener('change', this.#typeChangeHandler);
    form.addEventListener('change', this.#destinationChangeHandler);
    form.addEventListener('change', this.#offerCheckedHandler);
    form.addEventListener('change', this.#priceChangeHandler);
  }

  #priceInputHandler = (evt) => {
    evt.target.value = evt.target.value.replace(/[^0-9]/g, '');
  };

  #priceKeydownHandler = (evt) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

    if (!/[0-9]/.test(evt.key) && !allowedKeys.includes(evt.key)) {
      evt.preventDefault();
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handeleDeleteClick();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #priceChangeHandler = (evt) => {
    if (evt.target.name !== 'event-price') {
      return;
    }
    const newPrice = evt.target.value;
    this.updateElement({
      basePrice: newPrice || this._state.basePrice,
    });
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__type-input')) {
      const type = evt.target.value;
      this.updateElement({
        type: type,
      });
      if (this.#handleTypeChange) {
        const offers = this.#handleTypeChange(type);
        this.updateElement({
          resolvedOffers: offers,
        });
      }
    }
  };

  #destinationChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__input--destination')) {
      const destinationName = evt.target.value;

      const destination = this.#destinations.find(
        (dest) => dest.name === destinationName,
      );

      this.updateElement({
        destinationName: destinationName,
        destinationDescription: destination?.description || '-',
        destinationPictures: destination?.pictures || [],
        destination: destination?.id || '',
      });
    }
  };

  #offerCheckedHandler = (evt) => {
    if (evt.target.classList.contains('event__offer-checkbox')) {
      const offers = this._state.resolvedOffers.map((offer) => {
        if (offer.id === evt.target.dataset.offerid) {
          return {
            ...offer,
            isChecked: !offer.isChecked,
          };
        }
        return offer;
      });
      this.updateElement({
        resolvedOffers: offers,
      });
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate.toISOString(),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate.toISOString(),
    });
  };

  initDatePickers() {
    if (!this.element.isConnected) {
      return;
    }
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  reset() {
    this.updateElement(structuredClone(this.#initialState));
  }

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo,
      },
    );
  }

  #setDatepickerEnd() {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
      },
    );
  }

  static parsePointToState(point) {
    return {
      ...point,
      resolvedOffers: (point.resolvedOffers || []).map((offer) => ({
        ...offer,
      })),
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (point.resolvedOffers) {
      point.offers = point.resolvedOffers
        .filter((offer) => offer.isChecked)
        .map((offer) => offer.id);
    }

    return point;
  }
}
