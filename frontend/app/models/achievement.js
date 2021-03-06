import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default class AchievementModel extends Model {
  @attr() description;
  @attr() userId;
  @attr() targetStatus;
  @attr() target;

  @belongsTo('user') user;
}
