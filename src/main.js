import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
render(new FilterView(), filterContainer);

const siteMainElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: siteMainElement});

boardPresenter.init();

