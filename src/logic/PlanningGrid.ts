import { Buildable, Vec3 } from '.';

interface PlacedItem {
  buildable: Buildable;
  location: Vec3;
}

export class PlanningGrid {
  private placedItems = new Array<PlacedItem>();

  public place(buildable: Buildable, loc: Vec3): void {
    this.placedItems.push({ buildable, location: loc });

    console.log('Placed item', this.placedItems);
  }
}
