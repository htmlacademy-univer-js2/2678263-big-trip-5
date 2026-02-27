import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1firiey';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const siteMainElement = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const newEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});

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

newEventButton.disabled = true;

boardPresenter.init();
filterPresenter.init();
pointsModel.init().finally(() => {
  newEventButton.disabled = false;

  newEventButton.addEventListener('click', () => {
    boardPresenter.handleNewEventClick();
  });
});
