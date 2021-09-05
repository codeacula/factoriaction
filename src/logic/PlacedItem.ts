import { Buildable, Vec3 } from '.';

export class PlacedItem {
  constructor(buildable: Buildable, position: Vec3) {
    this.buildable = buildable;
    this.planningGridPosition = position;
  }

  private buildable: Buildable;
  private planningGridPosition: Vec3;

  /**
   * Does the placed item contain the provided planning grid unit within its bounding box
   * @param pos The position to check from
   */
  public contains(pos: Vec3): boolean {
    const bottomRight = new Vec3(
      this.planningGridPosition.x + this.buildable.width,
      this.planningGridPosition.y + this.buildable.height
    );

    return (
      pos.x >= this.planningGridPosition.x &&
      pos.x <= bottomRight.x &&
      pos.y >= this.planningGridPosition.y &&
      pos.y < bottomRight.y
    );
  }
}
