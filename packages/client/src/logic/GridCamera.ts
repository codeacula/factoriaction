import { BoundingBox } from './BoundingBox';
import { CurrentView } from './CurrentView';
import { Vec3 } from './Vec3';

/**
 * The viewport through which we view the grids
 */
export class GridCamera {
  public canvasDimensions = new Vec3();
  private dragCameraStart = new Vec3();
  private dragCursorStart = new Vec3();
  private movementIncrement = 0.5;
  private _position = new Vec3(); // The position of the camera on the virtual canvas
  private sizeOfUnitInPixels = 15;
  private zoomCeiling = 0.5; // We need a ceiling for zooming out because if we hit 0 app crashes
  private zoomFloor = 6; // Don't need to zoom in forever

  public get currentView(): CurrentView {
    const halfDimensions = this.canvasDimensions.div(2);

    const localPosition = new BoundingBox(Vec3.sub(new Vec3(), halfDimensions), Vec3.add(new Vec3(), halfDimensions));

    const virtualCanvas = new BoundingBox(
      Vec3.sub(this._position, halfDimensions),
      Vec3.add(this._position, halfDimensions)
    );

    const planningGrid = new BoundingBox(
      virtualCanvas.from.div(this.sizeOfUnitInPixels).floor(),
      virtualCanvas.to.div(this.sizeOfUnitInPixels).floor()
    );

    const localGrid = new BoundingBox(
      localPosition.from.div(this.sizeOfUnitInPixels).floor(),
      localPosition.to.div(this.sizeOfUnitInPixels).floor()
    );

    return {
      localGrid,
      planningGrid,
      virtualCanvas,
    };
  }

  /**
   * Returns a copy of the camera's current position
   */
  public get position(): Vec3 {
    return new Vec3(this._position.x, this._position.y, this._position.z);
  }

  /**
   * Moves the camera a negative fixed distance along the y axis
   */
  public back(): void {
    this._position.y -= this.movementIncrement;
  }

  /**
   * Moves the camera a positive fixed positive along the y axis
   */
  public forward(): void {
    this._position.y += this.movementIncrement;
  }

  /**
   * Moves the camera a fixed increment closer from the canvas, aka zoom in
   */
  public down(): void {
    this._position.z = Math.max(this._position.z - this.movementIncrement, this.zoomCeiling);
  }

  /**
   * Moves the camera a negative fixed increment along the x axis
   */
  public left(): void {
    this._position.x -= this.movementIncrement;
  }

  /**
   * Update the camera's position based on the drag event
   * @param position The new location of the cursor on the canvas
   */
  public mouseDragged(position: Vec3): void {
    this._position.x = this.dragCameraStart.x + (this.dragCursorStart.x - position.x);
    this._position.y = this.dragCameraStart.y + (this.dragCursorStart.y - position.y);
  }

  /**
   * Moves the camera a positive fixed distance along the x axis
   */
  public right(): void {
    this._position.x += this.movementIncrement;
  }

  /**
   * Tell the camera we're beginning a mouse drag event. We need to track where we start so we can accurately keep track
   * of where the camera should be while the user moves the cursor around
   * @param pos The position on the canvas where the mouse event starts
   */
  public startDragging(pos: Vec3): void {
    this.dragCursorStart = pos;
    this.dragCameraStart = this._position.copy();
  }

  /**
   * Moves the camera a fixed increment away to the canvas, aka zoom out
   */
  public up(): void {
    this._position.z = Math.min(this._position.z + this.movementIncrement, this.zoomFloor);
  }
}
