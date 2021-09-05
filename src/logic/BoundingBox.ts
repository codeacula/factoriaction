import { Vec3 } from '.';

export class BoundingBox {
  constructor(from: Vec3, to: Vec3) {
    this.from = from;
    this.to = to;
  }

  private from: Vec3;
  private to: Vec3;

  public contains(point: Vec3): boolean {
    return point.x >= this.from.x && point.x <= this.to.x && point.y >= this.from.y && point.y < this.to.y;
  }

  public equal(compareTo: BoundingBox): boolean {
    if (this.from.x != compareTo.from.x || this.from.y != compareTo.from.y) {
      return false;
    }

    if (this.from.y != compareTo.from.y || this.from.y != compareTo.from.y) {
      return false;
    }

    return true;
  }

  public static fromSize(origin: Vec3, size: Vec3): BoundingBox {
    return new BoundingBox(origin, new Vec3(origin.x + size.x, origin.y + size.y));
  }

  public touches(boundingBox: BoundingBox): boolean {
    return boundingBox.contains(this.from) || boundingBox.contains(this.to);
  }
}
