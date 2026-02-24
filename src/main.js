import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteMainElement = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  pointsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  pointsModel,
  filterModel,
});

if (newEventButton) {
  newEventButton.addEventListener('click', () => {
    boardPresenter.handleNewEventClick();
  });
}

boardPresenter.init();
filterPresenter.init();
