import { ActionInjectables } from "../ActionInjectables";

export interface PlanningAction {
  commit(injectable: ActionInjectables): void;
  revert(injectable: ActionInjectables): void;
}
