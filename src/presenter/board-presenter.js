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
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });
    this.#pointsListPresenter.init(points);
  }

  #handlePointChange = () => {
    // Callback для реакции на изменение точки маршрута
  };

  #handleModeChange = () => {
    // Callback для реакции на изменение точки маршрута
  };
}
