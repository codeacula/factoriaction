import { Placeable, PlacedItem } from '.';
import { BoundingBox } from './BoundingBox';

export class PlanningGrid {
  private placedItems = new Array<PlacedItem>();

  public getAllInArea(area: BoundingBox): PlacedItem[] {
    return this.placedItems.filter((item) => item.inside(area));
  }

  public place(placeable: Placeable): void {
    this.placedItems.push(new PlacedItem(placeable));
  }

  public remove(placeable: Placeable): void {
    const foundItem = this.placedItems.find((item) => {
      return item.equal(placeable);
    });

    if (!foundItem) {
      return;
    }

    this.placedItems.splice(this.placedItems.indexOf(foundItem), 1);
  }
}
