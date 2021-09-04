import { Vec3 } from "./Vec3";

export class GridCamera {
  private dragCameraStartX = 0;
  private dragCameraStartY = 0;
  private dragCursorStartX = 0;
  private dragCursorStartY = 0;

  private movementIncrement = 0.5;
  private _position = new Vec3();
  private zoomCeiling = 0.5;
  private zoomFloor = 6;

  public get x(): number {
    return this._position.x;
  }

  public get y(): number {
    return this._position.y;
  }

  public get z(): number {
    return this._position.z;
  }

  public get position(): Vec3 {
    return new Vec3(this._position.x, this._position.y, this._position.z);
  }

  public back(): void {
    this._position.y -= this.movementIncrement;
  }

  public forward(): void {
    this._position.y += this.movementIncrement;
  }

  public down(_offset?: { x: number; y: number }): void {
    const oldZ = this._position.z;
    const newZ = this._position.z + this.movementIncrement;
    this._position.z = Math.min(newZ, this.zoomFloor);

    if (oldZ == this._position.z) {
      return;
    }
  }

  public left(): void {
    this._position.x -= this.movementIncrement;
  }

  public mouseDragged(dragX: number, dragY: number): void {
    this._position.x = this.dragCameraStartX + (this.dragCursorStartX - dragX);
    this._position.y = this.dragCameraStartY + (this.dragCursorStartY - dragY);

    console.log("Position", this._position);
  }

  public right(): void {
    this._position.x += this.movementIncrement;
  }

  public startDragging(startX: number, startY: number): void {
    this.dragCursorStartX = startX;
    this.dragCursorStartY = startY;

    this.dragCameraStartX = this._position.x;
    this.dragCameraStartY = this._position.y;
  }

  public up(_offset?: { x: number; y: number }): void {
    const oldZ = this._position.z;
    const newZ = this._position.z - this.movementIncrement;
    this._position.z = Math.max(newZ, this.zoomCeiling);

    if (oldZ == this._position.z) {
      return;
    }
  }
}
