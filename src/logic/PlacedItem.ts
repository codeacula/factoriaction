import { Buildable, Vec3 } from '.';
import { BoundingBox } from './BoundingBox';

export class PlacedItem {
  constructor(buildable: Buildable, position: Vec3, image: CanvasImageSource) {
    this.buildable = buildable;
    this.image = image;
    this.position = position;
    this.boundingBox = BoundingBox.fromSize(position, new Vec3(this.buildable.width, this.buildable.height));
  }

  private boundingBox: BoundingBox;
  private buildable: Buildable;
  public image: CanvasImageSource;
  public position: Vec3;

  /**
   * Does the placed item contain the provided planning grid unit within its bounding box
   * @param pos The position to check from
   */
  public contains(pos: Vec3): boolean {
    return this.boundingBox.contains(pos);
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
