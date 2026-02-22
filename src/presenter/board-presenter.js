import PointsListPresenter from './points-list-presenter.js';
import { UpdateType, UserAction } from '../constants.js';
import FilterModel from '../model/filter-model.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = new FilterModel();
  #pointsListPresenter = null;

  constructor({ boardContainer, pointsModel, filterModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filterType = this.#filterModel.filter;
    const filteredPoints = this.#pointsModel.getFilteredPoints(filterType);
    const enrichedPoints = this.#pointsModel.getEnrichedPoints(filteredPoints);
    this.#pointsListPresenter = new PointsListPresenter({
      listContainer: this.#boardContainer,
      destinations: this.#pointsModel.destinations,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      getOffersByType: (type) => this.#pointsModel.getOfferByType(type),
      getDestinationById: (id) => this.#pointsModel.getDestinationById(id),
      getDescriptionById: (id) => this.#pointsModel.getDescriptionById(id),
      handleViewAction: this.#handleViewAction.bind(this),
    });
    this.#pointsListPresenter.init(enrichedPoints, filterType);
  }

  get points() {
    return this.#pointsModel.points;
  }

  #handlePointChange = (updateType, updatedPoint) => {
    this.#pointsModel.updatePoint(updateType, updatedPoint);
  };

  #handleModeChange = () => {
    // Callback для реакции на изменение точки маршрута
  };

  #clearBoard() {
    if (this.#pointsListPresenter) {
      this.#pointsListPresenter.destroy();
      this.#pointsListPresenter = null;
    }
  }

  #renderBoard() {
    const filterType = this.#filterModel.filter;
    const filteredPoints = this.#pointsModel.getFilteredPoints(filterType);
    const enrichedPoints = this.#pointsModel.getEnrichedPoints(filteredPoints);

    this.#pointsListPresenter = new PointsListPresenter({
      listContainer: this.#boardContainer,
      destinations: this.#pointsModel.destinations,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      getOffersByType: (type) => this.#pointsModel.getOfferByType(type),
      getDestinationById: (id) => this.#pointsModel.getDestinationById(id),
      getDescriptionById: (id) => this.#pointsModel.getDescriptionById(id),
      handleViewAction: this.#handleViewAction.bind(this),
    });
    this.#pointsListPresenter.init(enrichedPoints, filterType);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsListPresenter.updatePointById(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

}
