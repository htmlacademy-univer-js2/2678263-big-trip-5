import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';

import {render} from '../render.js';

const INITIAL_POINTS_COUNT = 3;

export default class BoardPresenter {

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
    this.pointListComponent = new PointListView();
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    render(new EditPointView(), this.pointListComponent.getElement());
    render(new AddNewPointView(), this.pointListComponent.getElement());

    for (let i = 0; i < INITIAL_POINTS_COUNT; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
