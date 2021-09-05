import { Buildable, PlacedItem, Vec3 } from '.';
import { BoundingBox } from './BoundingBox';

export class PlanningGrid {
  private placedItems = new Array<PlacedItem>();

  public getAllInArea(area: BoundingBox): PlacedItem[] {
    return this.placedItems.filter((item) => item.inside(area));
  }

  public place(buildable: Buildable, loc: Vec3, image: CanvasImageSource): void {
    this.placedItems.push(new PlacedItem(buildable, loc, image));
  }
}
