import { Buildable } from './Buildable';
import { GridCamera } from './GridCamera';
import { GridRenderer } from './GridRenderer';
import { MouseButtons } from './MouseButtons';
import { PlanningGrid } from './PlanningGrid';
import { Vec3 } from './Vec3';

export class PlanningBoard {
  constructor(canvas: HTMLCanvasElement) {
    this.providedCanvas = canvas;
    this.providedCanvas.oncontextmenu = () => {
      return false;
    };
    this.canvasParent = this.providedCanvas.parentElement;

    this.gridCamera = new GridCamera();
    this.planningGrid = new PlanningGrid();

    this.gridRenderer = new GridRenderer(this.providedCanvas, this.planningGrid, this.gridCamera);

    this.providedCanvas.addEventListener('mousedown', (ev: MouseEvent) => {
      if (ev.button == MouseButtons.Right) {
        this.providedCanvas.style.cursor = 'grab';
        this.gridCamera.startDragging(ev.offsetX, ev.offsetY);
        this.isDraggingCamera = true;
        ev.preventDefault();
      }
    });

    this.providedCanvas.addEventListener('mousemove', (ev: MouseEvent) => {
      if (this.isDraggingCamera) {
        this.gridCamera.mouseDragged(ev.offsetX, ev.offsetY);
        this.gridRenderer.render();
      }

      if (this.currentlySelectedBuildable && this.currentlySelectedBuildableImg) {
        this.gridRenderer.render(this.currentlySelectedBuildableImg, new Vec3(ev.offsetX, ev.offsetY));
      }
    });

    this.providedCanvas.addEventListener('mouseup', (ev: MouseEvent) => {
      // Right mouse button
      if (ev.button == MouseButtons.Right) {
        this.providedCanvas.style.cursor = 'auto';
        this.isDraggingCamera = false;
        ev.preventDefault();
      }
    });

    this.providedCanvas.addEventListener('wheel', (ev: WheelEvent) => {
      if (ev.deltaY < 0) {
        this.gridCamera.down({ x: ev.offsetX, y: ev.offsetY });
      } else {
        this.gridCamera.up({ x: ev.offsetX, y: ev.offsetY });
      }

      this.gridRenderer.render();
      this.gridRenderer.render(this.currentlySelectedBuildableImg ?? undefined, new Vec3(ev.offsetX, ev.offsetY));
    });

    window.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key == 'Escape') {
        this.cancelSelection();
        this.gridRenderer.render();
      }
    });

    window.addEventListener('resize', () => {
      this.recalculateCanvasAndRender();
    });

    this.recalculateCanvasAndRender();
  }

  private canvasParent: HTMLElement | null;
  private currentlySelectedBuildable: Buildable | null = null;
  private currentlySelectedBuildableImg: CanvasImageSource | null = null;
  private gridCamera: GridCamera;
  private gridRenderer: GridRenderer;
  private isDraggingCamera = false;
  private planningGrid: PlanningGrid;
  private providedCanvas: HTMLCanvasElement;
  private imageCache: Map<string, CanvasImageSource> = new Map();

  public cancelSelection(): void {
    this.currentlySelectedBuildable = null;
    this.gridRenderer.render();
  }

  private recalculateCanvasAndRender(): void {
    if (this.canvasParent) {
      this.providedCanvas.width = this.canvasParent.clientWidth;
      this.providedCanvas.height = this.canvasParent.clientHeight;
    }

    this.gridRenderer.calculateDeadCenter();
    this.gridRenderer.render();
  }

  public selectBuildable(buildable: Buildable): void {
    if (!this.imageCache.has(buildable.name)) {
      const buildableImage = new Image();
      buildableImage.src = `/icons/pngs/${buildable.imageName}`;

      this.imageCache.set(buildable.name, buildableImage);
    }

    this.currentlySelectedBuildable = buildable;
    this.currentlySelectedBuildableImg = this.imageCache.get(buildable.name) as CanvasImageSource;
  }
}
