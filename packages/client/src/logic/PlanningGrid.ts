import { Placeable, PlacedItem } from '.';
import { BoundingBox } from './BoundingBox';

/**
 * Holds all of the placed items, along with ways to manage or query them
 */
export class PlanningGrid {
  private placedItems = new Array<PlacedItem>();

  public getAllInArea(area: BoundingBox): PlacedItem[] {
    return this.placedItems.filter((item) => item.inside(area));
  }

  public getLastItem(): PlacedItem {
    return this.placedItems[this.placedItems.length - 1];
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
