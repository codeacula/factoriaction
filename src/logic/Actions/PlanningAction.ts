import { ActionInjectables } from '../ActionInjectables';

export abstract class PlanningAction {
  abstract commit(_injectable: ActionInjectables): void;
  abstract revert(_injectable: ActionInjectables): void;
}
