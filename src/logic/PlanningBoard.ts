import { GridCamera } from "./GridCamera";
import { GridRenderer } from "./GridRenderer";
import { PlanningGrid } from "./PlanningGrid";

export class PlanningBoard {
  constructor(canvas: HTMLCanvasElement) {
    this.providedCanvas = canvas;
    this.providedCanvas.oncontextmenu = () => {
      return false;
    };
    this.canvasParent = this.providedCanvas.parentElement;

    this.gridCamera = new GridCamera();
    this.planningGrid = new PlanningGrid();

    this.gridRenderer = new GridRenderer(
      this.providedCanvas,
      this.planningGrid,
      this.gridCamera
    );

    this.providedCanvas.addEventListener("mousedown", (ev: MouseEvent) => {
      if (ev.button == 2) {
        this.providedCanvas.style.cursor = "grab";
        this.gridCamera.startDragging(ev.offsetX, ev.offsetY);
        this.isDraggingCamera = true;
        ev.preventDefault();
      }
    });

    this.providedCanvas.addEventListener("mousemove", (ev: MouseEvent) => {
      if (this.isDraggingCamera) {
        this.gridCamera.mouseDragged(ev.offsetX, ev.offsetY);
        this.gridRenderer.render();
      }
    });

    this.providedCanvas.addEventListener("mouseup", (ev: MouseEvent) => {
      if (ev.button == 2) {
        this.providedCanvas.style.cursor = "auto";
        this.isDraggingCamera = false;
        ev.preventDefault();
      }
    });

    this.providedCanvas.addEventListener("wheel", (ev: WheelEvent) => {
      if (ev.deltaY < 0) {
        this.gridCamera.down({ x: ev.offsetX, y: ev.offsetY });
      } else {
        this.gridCamera.up({ x: ev.offsetX, y: ev.offsetY });
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
