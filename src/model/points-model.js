import Observable from '../framework/observable';
import { offersMock } from '../mock/offers';
import { destinationsMock } from '../mock/destination';
import { FilterType } from '../constants.js';
import { UpdateType } from '../constants';

export default class PointsModel extends Observable {
  #points = [];
  #offers;
  #destinations;
  #pointsApiService = null;

  constructor({ pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
    this.#offers = offersMock;
    this.#destinations = destinationsMock;
    this.#pointsApiService.points.then((points) => {
      console.log(points.map(this.#adaptToClient));
    });
  }

  pointAdapter(data) {
    console.log(data);
    return data.map((dataPoint) => ({
      'id': dataPoint.id,
      'base_price': dataPoint.base_price,
      'date_from': dataPoint.date_from,
      'date_to': dataPoint.date_to,
      'destination': dataPoint.destination,
      'is_favorite': dataPoint.is_favorite,
      'offers': [],
      'type': dataPoint.type
    }));
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    const allDestinations = this.destinations;
    return allDestinations.find((destination) => destination.id === id);
  }

  getDescriptionById(id) {
    const destination = this.getDestinationById(id);
    return destination?.description ?? '';
  }

  getOfferByType(type) {
    const allOffers = this.offers;
    return allOffers.find((offer) => offer.type === type);
  }

  getFilteredPoints(filterType) {
    const points = this.#points;

    switch (filterType) {
      case FilterType.FUTURE:
        return points.filter((point) => new Date(point.dateFrom) > new Date());
      case FilterType.PRESENT:
        return points.filter((point) => {
          const now = new Date();
          return new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now;
        });
      case FilterType.PAST:
        return points.filter((point) => new Date(point.dateTo) < new Date());
      default:
        return points;
    }
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Point not found');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, update);
  }

  addPoint(updateType, point) {
    this.#points = [point, ...this.#points];
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    const index = this.#points.findIndex((p) => p.id === point.id);

    if (index === -1) {
      throw new Error('Point not found');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, point);
  }

  getEnrichedPoints(pointsToEnrich = this.#points) {
    return pointsToEnrich.map((point) => {
      const destinationItem = this.getDestinationById(point.destination);
      const destinationName = destinationItem?.name ?? 'Unknown';
      const destinationDescription = destinationItem?.description ?? '';
      const destinationPictures = destinationItem?.pictures ?? [];
      const offerTypeGroup = this.getOfferByType(point.type);

      let resolvedOffers = [];

      if (offerTypeGroup && Array.isArray(offerTypeGroup.offers)) {
        resolvedOffers = point.offers
          .map((offerId) =>
            offerTypeGroup.offers.find((offer) => offer.id === offerId),
          )
          .filter(Boolean);

        resolvedOffers = resolvedOffers.map((offer) => ({
          ...offer,
          isChecked: offer.isChecked !== undefined ? offer.isChecked : true,
        }));
      }

      return {
        ...point,
        destinationName,
        destinationDescription,
        destinationPictures,
        resolvedOffers,
      };
    });
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
