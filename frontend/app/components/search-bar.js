import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

export default class SearchBarComponent extends Component {
  @inject
  store;

  /**
   * Actions to control dropdown status
   *
   * @memberof SearchBarComponent
   */
  dropdownActions

  /**
   *Value typed into the input
   *
   * @memberof SearchBarComponent
   */
  @tracked
  value = ''

  /**
   *Currently moused over search result
   *
   * @memberof SearchBarComponent
   */
  @tracked
  mousedOver

  /**
   * Loading status icon
   *
   * @memberof SearchBarComponent
   */
  @tracked
  loading = true

  /**
   *Search results
   *
   * @memberof SearchBarComponent
   */
  @tracked
  results = []


  /**
   * Perform the search and organise into groups by model type
   *
   * @memberof SearchBarComponent
   * @param {string} q
   */
  @(task(function* (q) {
    if (q === '') { return []; }
    yield timeout(600);
    this.loading = true;
    const res = yield this.query.perform(q);
    this.loading = false;

    return res;

  })).restartable() search;

  /**
   *Perform the search query
   *
   * @memberof SearchBarComponent
   * @param {string} q
   */
  @task(function* (q) {
    yield timeout(600);
    return fetch('kkl.wikonnect.com/api/v1/search/chapters?q=' + q);

    //return this.store.query('chapter', { 'q': q });
  }) query;


  /**
   * Handle typing into the input
   *
   * @memberof SearchBarComponent
   * @param {KeyboardEvent} e
   */
  @task(function* (e) {
    this.dropdownActions.open();
    this.results = yield this.search.perform(e.target.value);
  }) onInput

  /**
   * Stop default ember-basic-dropdown behaviour by preventing propegation of the event
   *
   * @param {string} value
   * @param {KeyDownEvent} e
   * @memberof SearchBarComponent
   */
  @action
  async onKeyDown(value, e) {
    e.stopImmediatePropagation();
  }


  /**
   * On element insert grab the actions for controlling the dropdown
   *
   * @param {*} actions
   * @memberof SearchBarComponent
   */
  @action
  registerDropdownActions(actions) {
    this.dropdownActions = actions;
  }

  /**
   * Open the dropdown on focus in
   *
   * @memberof SearchBarComponent
   */
  @action
  onFocusIn() {
    if (this.value.length) {
      this.dropdownActions.open();
    }
  }

  /**
   * Position for the dropdown
   *
   * @returns
   * @memberof SearchBarComponent
   */
  @action
  dropdownPosition() {
    return { style: { left: 0, top: 56 } };
  }

  /**
   * Stop default ember-basic-dropdown behaviour by preventing propegation of the event
   *
   * @param {KeyDownEvent} e
   * @memberof SearchBarComponent
   */
  prevent(e) {
    return e.stopImmediatePropagation();
  }
}