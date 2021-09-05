import { PlacedItem } from '.';
import { Buildable } from './Buildable';
import { GridCamera } from './GridCamera';
import { GridRenderer } from './GridRenderer';
import { MouseButtons } from './MouseButtons';
import { PlanningGrid } from './PlanningGrid';
import { Vec3 } from './Vec3';

function convertToVec3(ev: MouseEvent | WheelEvent): Vec3 {
  return new Vec3(ev.offsetX, ev.offsetY);
}

export class PlanningBoardController {
  constructor(canvas: HTMLCanvasElement) {
    this.setupCanvas(canvas);
    this.bindActionsToWindow();
    this.gridRenderer = new GridRenderer(this.providedCanvas, this.gridCamera);

    this.recalculateCanvasAndRender();
  }

  private canvasParent!: HTMLElement | null;
  private currentlySelectedBuildable: Buildable | null = null;
  private currentlySelectedBuildableImg: CanvasImageSource | null = null;
  private gridCamera = new GridCamera();
  private gridRenderer: GridRenderer;
  private isDraggingCamera = false;
  private planningGrid = new PlanningGrid();
  private providedCanvas!: HTMLCanvasElement;
  private imageCache: Map<string, CanvasImageSource> = new Map();

  private bindActionsToWindow(): void {
    window.addEventListener('keydown', (ev) => {
      this.onKeyDown(ev);
    });

    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  public cancelSelection(): void {
    this.currentlySelectedBuildable = null;
    this.render();
  }

  private onKeyDown(ev: KeyboardEvent): void {
    if (ev.key == 'Escape') {
      this.cancelSelection();
      this.render();
    }
  }

  private onMouseDown(ev: MouseEvent): void {
    const eventLoc = convertToVec3(ev);
    if (ev.button == MouseButtons.Left) {
      if (this.currentlySelectedBuildable) {
        const mouseGridPos = this.gridRenderer.getPlanningGridLocation(eventLoc);
        this.planningGrid.place(this.currentlySelectedBuildable, mouseGridPos);
      }
    } else if (ev.button == MouseButtons.Right) {
      this.providedCanvas.style.cursor = 'grab';
      this.gridCamera.startDragging(eventLoc);
      this.isDraggingCamera = true;
      ev.preventDefault();
    }
  }

  private onMouseMove(ev: MouseEvent): void {
    const eventLoc = convertToVec3(ev);
    if (this.isDraggingCamera) {
      this.gridCamera.mouseDragged(eventLoc);
      this.render();
    }

    if (this.currentlySelectedBuildable && this.currentlySelectedBuildableImg) {
      this.updateSelectedItem(eventLoc);
      this.render();
    }
  }

  private onMouseUp(ev: MouseEvent): void {
    // Right mouse button
    if (ev.button == MouseButtons.Right) {
      this.providedCanvas.style.cursor = 'auto';
      this.isDraggingCamera = false;
      ev.preventDefault();
    }
  }

  private onMouseWheel(ev: WheelEvent): void {
    const vec = convertToVec3(ev);
    if (ev.deltaY < 0) {
      this.gridCamera.down(vec);
    } else {
      this.gridCamera.up(vec);
    }

    this.updateSelectedItem(vec);

    this.gridRenderer.render(this.currentlySelectedBuildableImg ?? undefined, vec);
  }

  private onResize(): void {
    this.recalculateCanvasAndRender();
  }

  private recalculateCanvasAndRender(): void {
    if (this.canvasParent) {
      this.providedCanvas.width = this.canvasParent.clientWidth;
      this.providedCanvas.height = this.canvasParent.clientHeight;
    }

    this.gridRenderer.calculateCenterOfCanvas();
    this.render();
  }

  private render(): void {
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

  public setupCanvas(canvas: HTMLCanvasElement): void {
    this.providedCanvas = canvas;
    this.providedCanvas.oncontextmenu = () => {
      return false;
    };
    this.canvasParent = this.providedCanvas.parentElement;

    this.providedCanvas.addEventListener('mousedown', (ev) => {
      this.onMouseDown(ev);
    });

    this.providedCanvas.addEventListener('mousemove', (ev) => {
      this.onMouseMove(ev);
    });

    this.providedCanvas.addEventListener('mouseup', (ev) => {
      this.onMouseUp(ev);
    });

    this.providedCanvas.addEventListener('wheel', (ev) => {
      this.onMouseWheel(ev);
    });
  }

  /**
   * Gets the planning grid location of the provided Vec3 and updates the grid renderer with the selected buildable,
   * if one it selected and a grid position is returned
   * @param pos The canvas location to find the planning grid coordinates from
   */
  private updateSelectedItem(pos: Vec3): void {
    if (this.currentlySelectedBuildable == null) {
      return;
    }

    const planningGridLoc = this.gridRenderer.getPlanningGridLocation(pos);
    this.gridRenderer.currentlySelectedItem = new PlacedItem(this.currentlySelectedBuildable, planningGridLoc);
  }
}
