/* eslint-disable @typescript-eslint/no-empty-function */
import { ActionInjectables } from '../ActionInjectables';

export interface PlanningAction {
  commit(_injectable: ActionInjectables): void;
  revert(_injectable: ActionInjectables): void;
}
