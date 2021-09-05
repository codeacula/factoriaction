import { Vec3 } from './Vec3';

export class GridCamera {
  private dragCameraStart = new Vec3();
  private dragCursorStart = new Vec3();
  private movementIncrement = 0.5;
  private _position = new Vec3(); // This position relates to the virtual canvas, not the actual HTML canvas
  private zoomCeiling = 0.5; // We need a ceiling for zooming out because if we hit 0 app crashes
  private zoomFloor = 6; // Don't need to zoom in forever

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

  public mouseDragged(position: Vec3): void {
    this._position.x = this.dragCameraStart.x + (this.dragCursorStart.x - position.x);
    this._position.y = this.dragCameraStart.y + (this.dragCursorStart.y - position.y);
  }

  public right(): void {
    this._position.x += this.movementIncrement;
  }

  public startDragging(pos: Vec3): void {
    this.dragCursorStart = pos;
    this.dragCameraStart = this._position.copy();
  }

  public up(_offset?: Vec3): void {
    const oldZ = this._position.z;
    const newZ = this._position.z - this.movementIncrement;
    this._position.z = Math.max(newZ, this.zoomCeiling);

    if (oldZ == this._position.z) {
      return;
    }
  }
}
