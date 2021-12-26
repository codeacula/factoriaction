import { Vec3 } from '.';

/**
 * A 2D box based on a from and two point
 */
export class BoundingBox {
  constructor(from: Vec3, to: Vec3) {
    this._from = from;
    this._to = to;
  }

  private _from: Vec3;
  private _to: Vec3;

  public get from(): Vec3 {
    return this._from.copy();
  }

  public get to(): Vec3 {
    return this._to.copy();
  }

  public contains(point: Vec3): boolean {
    return point.x >= this._from.x && point.x <= this._to.x && point.y >= this._from.y && point.y < this._to.y;
  }

  public equal(compareTo: BoundingBox): boolean {
    if (this._from.x != compareTo._from.x || this._from.y != compareTo._from.y) {
      return false;
    }

    if (this._to.x != compareTo._to.x || this._to.y != compareTo._to.y) {
      return false;
    }

    return true;
  }

  public static fromSize(origin: Vec3, size: Vec3): BoundingBox {
    return new BoundingBox(origin, new Vec3(origin.x + size.x, origin.y + size.y));
  }

  public touches(boundingBox: BoundingBox): boolean {
    // Top left and bottom right corners
    if (this.contains(boundingBox._from) || this.contains(boundingBox._to)) {
      return true;
    }

    // Top right and bottom left corners
    if (
      boundingBox.contains(new Vec3(this._from.x, this._to.y)) ||
      boundingBox.contains(new Vec3(this._to.x, this._from.y))
    ) {
      return true;
    }

    return false;
  }
}
