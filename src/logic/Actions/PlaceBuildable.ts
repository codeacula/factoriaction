import { PlanningAction } from '.';
import { Placeable } from '..';
import { ActionInjectables } from '../ActionInjectables';

export class PlaceBuildable implements PlanningAction {
  constructor(placeable: Placeable) {
    this.placeable = placeable;
  }

  placeable: Placeable;

  commit(injectable: ActionInjectables): void {
    injectable.planningGrid.place(this.placeable);
    return;
  }

  revert(): void {
    return;
  }
}
