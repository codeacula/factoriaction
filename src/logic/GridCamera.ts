export class GridCamera {
  private dragCameraStartX = 0;
  private dragCameraStartY = 0;
  private dragCursorStartX = 0;
  private dragCursorStartY = 0;

  private movementIncrement = 0.5;
  private zoomCeiling = 0.5;
  private zoomFloor = 6;
  private _x = 0;
  private _y = 0;
  private _z = 1;

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get z(): number {
    return this._z;
  }

  public back(): void {
    this._y -= this.movementIncrement;
  }

  public forward(): void {
    this._y += this.movementIncrement;
  }

  public down(): void {
    const newZ = this._z + this.movementIncrement;
    console.log("These stairs go down!", newZ);
    this._z = Math.min(newZ, this.zoomFloor);
  }

  public left(): void {
    this._x -= this.movementIncrement;
  }

  public mouseDragged(dragX: number, dragY: number) {
    this._x = this.dragCameraStartX + (this.dragCursorStartX - dragX);
    this._y = this.dragCameraStartY + (this.dragCursorStartY - dragY);
  }

  public right(): void {
    this._x += this.movementIncrement;
  }

  public startDragging(startX: number, startY: number) {
    this.dragCursorStartX = startX;
    this.dragCursorStartY = startY;

    this.dragCameraStartX = this._x;
    this.dragCameraStartY = this._y;
  }

  public up(): void {
    const newZ = this._z - this.movementIncrement;
    this._z = Math.max(newZ, this.zoomCeiling);
  }
}
