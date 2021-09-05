import { PlanningAction } from '.';
import { ActionInjectables } from '../ActionInjectables';

export class PlaceBuildable extends PlanningAction {
  commit(injectable: ActionInjectables): void {
    console.log(injectable);
    return;
  }

  revert(): void {
    return;
  }
}
