import { INITIAL_POINTS_COUNT } from '../constants';
import { getPointRandom } from '../mock/points';
import { offersMock } from '../mock/offers';
import { destinationsMock } from '../mock/destination';

export default class PointsModel {
  constructor() {
    this.points = Array.from({ length: INITIAL_POINTS_COUNT }, getPointRandom);
    this.offers = offersMock;
    this.destinations = destinationsMock;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    const allDestinations = this.getDestinations();
    return allDestinations.find((destination) => destination.id === id);
  }

  getOfferByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, offersId) {
    const offersTypes = this.getOfferByType(type);
    return offersTypes.offers.find((offer) => offer.id === offersId);
  }
}
