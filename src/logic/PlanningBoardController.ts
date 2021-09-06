import { Placeable } from '.';
import { ActionInjectables } from './ActionInjectables';
import { PlaceBuildable, PlanningAction } from './Actions';
import { Buildable } from './Buildable';
import { GridCamera } from './GridCamera';
import { GridRenderer } from './GridRenderer';
import { MouseButtons } from './MouseButtons';
import { PlanningGrid } from './PlanningGrid';
import { Vec3 } from './Vec3';

function convertToVec3(ev: MouseEvent | WheelEvent): Vec3 {
  return new Vec3(ev.offsetX, ev.offsetY);
}

enum States {
  None,
  Dragging,
  Rotating,
}

export class PlanningBoardController {
  constructor(canvas: HTMLCanvasElement) {
    this.setupCanvas(canvas);
    this.bindActionsToWindow();
    this.gridRenderer = new GridRenderer(this.providedCanvas, this.gridCamera, this.planningGrid);

    this.recalculateCanvasAndRender();
  }

  private actionQueue: PlanningAction[] = [];
  private canvasParent!: HTMLElement | null;
  private currentlySelectedPlaceable: Placeable | null = null;
  private currentState = States.None;
  private gridCamera = new GridCamera();
  private gridRenderer: GridRenderer;
  private planningGrid = new PlanningGrid();
  private providedCanvas!: HTMLCanvasElement;
  private imageCache: Map<string, CanvasImageSource> = new Map();
  private redoQueue: PlanningAction[] = [];

  private bindActionsToWindow(): void {
    window.addEventListener('keydown', (ev) => {
      this.onKeyDown(ev);
    });

    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  public cancelSelection(): void {
    this.currentlySelectedPlaceable = null;
    this.gridRenderer.updateSelectedBuildable(null);
    this.render();
  }

  public get injectables(): ActionInjectables {
    return {
      gridCamera: this.gridCamera,
      gridRenderer: this.gridRenderer,
      planningGrid: this.planningGrid,
    };
  }

  private onKeyDown(ev: KeyboardEvent): void {
    if (ev.key == 'Escape') {
      this.cancelSelection();
      this.render();
    } else if (ev.key == 'z' && ev.ctrlKey) {
      this.undoLastAction();
    } else if (ev.key == 'y' && ev.ctrlKey) {
      this.redoLastAction();
    }
  }

  private onMouseDown(ev: MouseEvent): void {
    const eventLoc = convertToVec3(ev);
    if (ev.button == MouseButtons.Left) {
      if (this.currentlySelectedPlaceable) {
        const mouseGridPos = this.gridRenderer.getPlanningGridLocation(eventLoc);
        const placeable: Placeable = {
          buildable: this.currentlySelectedPlaceable.buildable,
          image: this.currentlySelectedPlaceable.image,
          position: mouseGridPos,
        };

        this.sendAction(new PlaceBuildable(placeable));
        this.render();
      }
    } else if (ev.button == MouseButtons.Right) {
      this.providedCanvas.style.cursor = 'grab';
      this.gridCamera.startDragging(eventLoc);
      this.currentState = States.Dragging;
      ev.preventDefault();
    }
  }

  private onMouseMove(ev: MouseEvent): void {
    const eventLoc = convertToVec3(ev);
    if (this.currentState == States.Dragging) {
      this.gridCamera.mouseDragged(eventLoc);
      this.render();
    }

    if (this.currentlySelectedPlaceable) {
      this.updateSelectedItem(eventLoc);
      this.render();
    }
  }

  private onMouseUp(ev: MouseEvent): void {
    // Right mouse button
    if (ev.button == MouseButtons.Right) {
      this.providedCanvas.style.cursor = 'auto';
      this.currentState = States.None;
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

    this.gridRenderer.render();
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

  private redoLastAction(): void {
    const lastaction = this.redoQueue.pop();

    if (!lastaction) {
      return;
    }

    // We can't do sendAction because it clears the redo queue
    lastaction.commit(this.injectables);
    this.actionQueue.push(lastaction);
    this.render();
  }

  private render(): void {
    this.gridRenderer.render();
  }

  /**
   * Tells the controller that a buildable has been selected from the build menu
   * @param buildable
   */
  public selectBuildable(buildable: Buildable): void {
    if (!this.imageCache.has(buildable.name)) {
      const buildableImage = new Image();
      buildableImage.src = `/icons/pngs/${buildable.imageName}`;

      this.imageCache.set(buildable.name, buildableImage);
    }

    this.currentlySelectedPlaceable = {
      buildable,
      image: this.imageCache.get(buildable.name) as CanvasImageSource,
      position: new Vec3(),
    };
    this.gridRenderer.updateSelectedBuildable(this.currentlySelectedPlaceable);
  }

  private sendAction(action: PlanningAction) {
    action.commit(this.injectables);
    this.actionQueue.push(action);
    this.redoQueue = [];
  }

  /**
   * Given a canvas tag, extracts needed information from it and sets up event hooks
   * @param canvas
   */
  private setupCanvas(canvas: HTMLCanvasElement): void {
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

  private undoLastAction(): void {
    const lastaction = this.actionQueue.pop();

    if (!lastaction) {
      return;
    }

    lastaction.revert(this.injectables);
    this.redoQueue.push(lastaction);
    this.render();
  }

  /**
   * Tells the planning grid the location of the currently selected item has changed
   * @param pos The canvas location to find the planning grid coordinates from
   */
  private updateSelectedItem(pos: Vec3): void {
    this.gridRenderer.updateSelectedBuildableLocation(pos);
    this.render();
  }
}
