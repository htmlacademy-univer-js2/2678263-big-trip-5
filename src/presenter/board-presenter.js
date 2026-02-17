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
      getOffersByType: (type) => this.#pointsModel.getOfferByType(type),
      getDestinationById: (id) => this.#pointsModel.getDestinationById(id),
      getDescriptionById: (id) => this.#pointsModel.getDescriptionById(id),
    });
    this.#pointsListPresenter.init(points);
  }

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointsListPresenter.updatePoint(updatedPoint);
  };

  #handleModeChange = () => {
    // Callback для реакции на изменение точки маршрута
  };
}
