import { GridCamera } from "./GridCamera";
import { GridRenderer } from "./GridRenderer";
import { PlanningGrid } from "./PlanningGrid";

export class PlanningBoard {
  constructor(canvas: HTMLCanvasElement) {
    this.providedCanvas = canvas;
    this.canvasParent = this.providedCanvas.parentElement;

    this.gridCamera = new GridCamera();
    this.planningGrid = new PlanningGrid();

    this.gridRenderer = new GridRenderer(
      this.providedCanvas,
      this.planningGrid,
      this.gridCamera
    );

    window.addEventListener("keydown", (ev: KeyboardEvent) => {
      console.log("Key down", ev);
    });

    this.providedCanvas.addEventListener("mousedown", (ev: MouseEvent) => {
      this.gridCamera.startDragging(ev.offsetX, ev.offsetY);
      this.isDraggingCamera = true;
    });

    this.providedCanvas.addEventListener("mousemove", (ev: MouseEvent) => {
      if (this.isDraggingCamera) {
        this.gridCamera.mouseDragged(ev.offsetX, ev.offsetY);
        this.gridRenderer.render();
      }
    });

    this.providedCanvas.addEventListener("mouseup", () => {
      this.isDraggingCamera = false;
    });

    this.providedCanvas.addEventListener("wheel", (ev: WheelEvent) => {
      if (ev.deltaY < 0) {
        this.gridCamera.down();
      } else {
        this.gridCamera.up();
      }

      this.gridRenderer.render();
    });

    if (this.canvasParent) {
      this.canvasParent.addEventListener("resize", () => {
        this.fitCanvasToParent();
        this.gridRenderer.render();
      });
    }

    this.fitCanvasToParent();
    this.gridRenderer.updateCenter();
    this.gridRenderer.render();
  }

  private canvasParent: HTMLElement | null;
  private gridCamera: GridCamera;
  private gridRenderer: GridRenderer;
  private isDraggingCamera = false;
  private planningGrid: PlanningGrid;
  private providedCanvas: HTMLCanvasElement;

  private fitCanvasToParent(): void {
    if (this.canvasParent) {
      this.providedCanvas.width = this.canvasParent.clientWidth;
      this.providedCanvas.height = this.canvasParent.clientHeight;
    }
  }
}
