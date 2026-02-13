import PointsModel from '../model/points-model.js';
import PointsListPresenter from './points-list-presenter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = new PointsModel();
  #pointsListPresenter = null;

  constructor({ boardContainer }) {
    this.#boardContainer = boardContainer;
  }

  init() {
    const points = this.#pointsModel.getEnrichedPoints();
    this.#pointsListPresenter = new PointsListPresenter({
      listContainer: this.#boardContainer,
      destinations: this.#pointsModel.destinations,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      getOffersByType: (type) => {
        const result = this.#pointsModel.getOfferByType(type);
        return result;
      },

      getDestinationById: (id) => {
        const result = this.#pointsModel.getDestinationById(id);
        return result;
      },
      getDescriptionById: (id) => {
        const result = this.#pointsModel.getDescriptionById(id);
        return result;
      },
    });
    this.#pointsListPresenter.init(points);
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);

    const enrichedPoint = this.#pointsModel
      .getEnrichedPoints()
      .find((point) => point.id === updatedPoint.id);

    this.#pointsListPresenter.updatePoint(enrichedPoint);
  };

  #handleModeChange = () => {
    // Callback для реакции на изменение точки маршрута
  };
}
