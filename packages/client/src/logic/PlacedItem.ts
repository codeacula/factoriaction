import { Buildable, Placeable, Vec3 } from '.';
import { BoundingBox } from './BoundingBox';
import { Rotation } from './Rotation';

/**
 * An item that has been placed on a planning grid. Contains helper functions for comparing placed items
 */
export class PlacedItem {
  constructor(placeable: Placeable) {
    this.buildable = placeable.buildable;
    this.image = placeable.image;
    this.position = placeable.position;
    this.boundingBox = BoundingBox.fromSize(placeable.position, new Vec3(this.buildable.width, this.buildable.height));
  }

  public boundingBox: BoundingBox;
  public buildable: Buildable;
  public image: CanvasImageSource;
  public position: Vec3;
  public rotation = Rotation.Down;

  /**
   * Does the placed item contain the provided planning grid unit within its bounding box
   * @param pos The position to check from
   */
  public contains(pos: Vec3): boolean {
    return this.boundingBox.contains(pos);
  }

  /**
   * Are these two placed items the same?
   * @param compareTo
   * @returns
   */
  public equal(compareTo: Placeable): boolean {
    if (!this.position.equal(compareTo.position)) {
      return false;
    }

    if (!(this.buildable.name == compareTo.buildable.name)) {
      return false;
    }

    return true;
  }

  /**
   * See if the placeable has any part inside of the provided bounding bod
   * @param boundingBox
   * @returns
   */
  public inside(boundingBox: BoundingBox): boolean {
    return this.boundingBox.touches(boundingBox);
  }
}
