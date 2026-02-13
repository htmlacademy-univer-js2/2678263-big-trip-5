import { INITIAL_POINTS_COUNT } from '../constants';
import { getPointRandom } from '../mock/points';
import { offersMock } from '../mock/offers';
import { destinationsMock } from '../mock/destination';

export default class PointsModel {
  #points;
  #offers;
  #destinations;
  constructor() {
    this.#points = Array.from({ length: INITIAL_POINTS_COUNT }, getPointRandom);
    this.#offers = offersMock;
    this.#destinations = destinationsMock;
  }

  get points() {
    return this.#points;
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

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point,
    );
  }

  getEnrichedPoints() {
    return this.#points.map((point) => {
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
}
