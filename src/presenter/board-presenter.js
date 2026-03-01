import PointsListPresenter from './points-list-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { UpdateType, UserAction, FilterType } from '../constants.js';
import FilterModel from '../model/filter-model.js';
import { render, remove } from '../framework/render.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = new FilterModel();
  #pointsListPresenter = null;
  #newPointPresenter = null;
  #isCreatingNewPoint = false;
  #loadingComponent = new LoadingView();

  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ boardContainer, pointsModel, filterModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      listContainer: this.#boardContainer,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction.bind(this),
      onDestroy: this.#handleNewPointFormClose,
      getOffersByType: (type) => this.#pointsModel.getOfferByType(type),
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    return this.#pointsModel.points;
  }

  handleNewEventClick = () => {
    this.#pointsListPresenter?.handleModeChange?.();
    if (this.#isCreatingNewPoint) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointsListPresenter?.handleModeChange?.();
    this.#isCreatingNewPoint = true;
    this.#newPointPresenter.init();
  };

  #handleNewPointFormClose = () => {
    this.#isCreatingNewPoint = false;
  };

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
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#boardContainer);
      return;
    }
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT: {
        const pointPresenterSaved = this.#pointsListPresenter.getPointPresenterById(
          update.id,
        );
        pointPresenterSaved.setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
          pointPresenterSaved.setSaved();
        } catch (err) {
          pointPresenterSaved.setAborting();
        }
        break;
      }
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT: {
        const pointPresenter = this.#pointsListPresenter.getPointPresenterById(
          update.id,
        );
        pointPresenter?.setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
          pointPresenter.destroy();
        } catch (err) {
          pointPresenter?.setAborting();
        }
        break;
      }
    }
    this.#uiBlocker.unblock();
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
        if (this.#isCreatingNewPoint) {
          this.#newPointPresenter.destroy();
          this.#isCreatingNewPoint = false;
        }
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };
}
