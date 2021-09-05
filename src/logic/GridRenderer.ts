import { PlacedItem, PlanningGrid } from '.';
import { BoundingBox } from './BoundingBox';
import { GridCamera } from './GridCamera';
import { GridCell } from './GridCell';
import { Vec3 } from './Vec3';

export class GridRenderer {
  constructor(canvas: HTMLCanvasElement, camera: GridCamera, planningGrid: PlanningGrid) {
    this.camera = camera;
    this.canvas = canvas;
    this.planningGrid = planningGrid;

    const drawingContext = this.canvas.getContext('2d', {
      alpha: true,
    });

    if (!drawingContext) {
      throw new Error('Unable to get a drawing context from the provided canvas');
    }

    this.context = drawingContext;
    this.context.font = '16px "Roboto Mono"';
  }

  private camera: GridCamera;
  private canvas: HTMLCanvasElement;
  private centerOfCanvas: Vec3 = new Vec3();
  private context: CanvasRenderingContext2D;
  public currentlySelectedItem: PlacedItem | null = null;

  // We have to offset the draw by 0.5 so that we get correct pixel sizes
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#a_linewidth_example
  private drawOffset = 0.5;

  // How many pixels in an image represent 1m on the grid
  private pixelsPerGrid = 10;
  private planningGrid: PlanningGrid;
  private planningGridBounds = new BoundingBox(new Vec3(), new Vec3());

  private scene = new Array<Array<GridCell>>();
  private sceneByCanvasXY: { [x: number]: { [y: number]: GridCell } } = {};
  private sceneByPlanningGridXY: { [x: number]: { [y: number]: GridCell } } = {};

  // Decides how many pixels should be between grid lines on a standard, unzoomed view
  private sizeOfUnitInPixels = 15;

  /**
   * Given the camera position, builds the graph of what coords the user should see and where
   */
  private buildScene(): void {
    this.scene = new Array<Array<GridCell>>();
    const canvasStartingPoint = this.getPlanningGridCenterOnCanvas();
    const planningGridOrigin = this.getPlanningGridCameraLocation();
    const pixelsBetweenLines = this.getPixelsBetweenLines();

    // Figure out where on the canvas the grid will start
    const topLeft = canvasStartingPoint.mod(pixelsBetweenLines);
    const totalUnits = new Vec3(
      Math.floor(this.canvas.width / pixelsBetweenLines),
      Math.floor(this.canvas.height / pixelsBetweenLines)
    );

    // Where is the top left point at on the planning grid?
    const diffBetweenTopLeftAndCenter = Vec3.sub(canvasStartingPoint, topLeft);
    const topLeftPlanningGrid = Vec3.sub(planningGridOrigin, diffBetweenTopLeftAndCenter.div(pixelsBetweenLines));
    const topLeftOriginGrid = Vec3.sub(new Vec3(0, 0), diffBetweenTopLeftAndCenter.div(pixelsBetweenLines));

    let lastYBuilt: GridCell | null = null;
    for (let x = 0; x < totalUnits.x; x++) {
      const currentArr = new Array<GridCell>();
      this.scene.push(currentArr);
      const xCanvasOffset = x * pixelsBetweenLines;

      this.sceneByCanvasXY[xCanvasOffset] = {};

      for (let y = 0; y < totalUnits.y; y++) {
        const yCanvasOffset = y * pixelsBetweenLines;
        const gridCell: GridCell = {
          canvasLocation: new Vec3(topLeft.x + xCanvasOffset, topLeft.y + yCanvasOffset),
          localGridLocation: new Vec3(topLeftOriginGrid.x + x, topLeftOriginGrid.y + y),
          planningGridLocation: new Vec3(topLeftPlanningGrid.x + x, topLeftPlanningGrid.y + y),
        };

        currentArr.push(gridCell);
        lastYBuilt = gridCell;

        if (!this.sceneByPlanningGridXY[gridCell.planningGridLocation.x]) {
          this.sceneByPlanningGridXY[gridCell.planningGridLocation.x] = {};
        }

        this.sceneByPlanningGridXY[gridCell.planningGridLocation.x][gridCell.planningGridLocation.y] = gridCell;
        this.sceneByCanvasXY[xCanvasOffset][yCanvasOffset] = gridCell;
      }
    }

    if (lastYBuilt) {
      this.planningGridBounds = new BoundingBox(topLeftPlanningGrid, lastYBuilt.planningGridLocation);
    }
  }

  /**
   * Determine where on the canvas (0, 0) should be if the camera was dead center
   */
  public calculateCenterOfCanvas(): void {
    const halfX = Math.floor(this.canvas.width / 2);
    const halfY = Math.floor(this.canvas.height / 2);
    this.centerOfCanvas = new Vec3(halfX, halfY);
  }

  /**
   * Clear the drawing canvas
   */
  private clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawPlacedItem(item: PlacedItem, opacity = 1) {
    const cell = this.getCellByPlanningGrid(item.position);

    const snapPos = cell.canvasLocation;

    const displayWidth = ((item.image.width as number) / this.pixelsPerGrid) * this.getPixelsBetweenLines();
    const displayHeight = ((item.image.height as number) / this.pixelsPerGrid) * this.getPixelsBetweenLines();

    this.context.globalAlpha = opacity;
    this.context.drawImage(item.image, snapPos.x, snapPos.y, displayWidth, displayHeight);
    this.context.globalAlpha = 1;
  }

  /**
   * Draws a grid across the X and Y axis
   * @param unitsApart How many Satisfactory units (m's) should be between each line
   * @param color What color to paint the line
   */
  private drawGrid(unitsApart: number, color: string) {
    this.drawXGrid(unitsApart, color);
    this.drawYGrid(unitsApart, color);
  }

  /**
   * Draws a line between the two provided points
   * @param from Point on the canvas the line should start
   * @param to Point on the canvas the line should end
   * @param color Color the line should be
   * @param width How many pixels wide should the line be
   */
  private drawLine(from: Vec3, to: Vec3, color: string, width = 1) {
    this.context.beginPath();
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  /**
   * Draws the grid on the X-axis
   * @param unitsApart How far apart in pixels should each column be
   * @param color What color should the line be
   */
  private drawXGrid(unitsApart: number, color: string): void {
    const xVals = this.scene.map((x) => x[0]);

    xVals.forEach((cell) => {
      if (cell.planningGridLocation.x % unitsApart == 0) {
        let xcoord = cell.canvasLocation.x;
        xcoord += Number.isInteger(cell.canvasLocation.x) ? this.drawOffset : 0;

        this.drawLine(new Vec3(xcoord, 0), new Vec3(xcoord, this.canvas.height), color);
      }
    });
  }

  /**
   * Draws the grid on the Y-axis
   * @param unitsApart How far apart in pixels each column should be
   * @param color What color should the line be
   */
  private drawYGrid(unitsApart: number, color: string) {
    const yVals = this.scene[0];

    yVals.forEach((cell) => {
      if (cell.planningGridLocation.y % unitsApart == 0) {
        let ycoord = cell.canvasLocation.y;
        ycoord += Number.isInteger(cell.canvasLocation.y) ? this.drawOffset : 0;

        this.drawLine(new Vec3(0, ycoord), new Vec3(this.canvas.width, ycoord), color);
      }
    });
  }

  /**
   * Given a set of planning grid coordinates, returns matching cell or throws errors
   * @param pos
   * @returns
   */
  public getCellByPlanningGrid(pos: Vec3): GridCell {
    if (!this.sceneByPlanningGridXY[pos.x]) {
      throw new Error(`No cell stored at X:${pos.x} location`);
    }

    if (!this.sceneByPlanningGridXY[pos.x][pos.y]) {
      throw new Error(`No cell stored at Y:${pos.y} location`);
    }

    return this.sceneByPlanningGridXY[pos.x][pos.y];
  }

  private getPlanningGridCameraLocation(): Vec3 {
    return this.camera.position.div(this.getPixelsBetweenLines()).floor();
  }

  /**
   * Finds where the current planning grid center is in relation to the canvas element
   * @returns
   */
  private getPlanningGridCenterOnCanvas(): Vec3 {
    // Figure out where the camera's snapping point is in relation to the planning grid
    const cameraPlanningGridCenter = this.getPlanningGridCameraLocation();

    // Figure out how many pixels the grid translates to for when we need to find the drawing
    // start point
    const gridCenterPixelAmount = cameraPlanningGridCenter.mul(this.getPixelsBetweenLines()); // -> [-615, -825]

    // How many pixels is the current snapping point off from the camera position
    const offsetFromCamera = Vec3.sub(this.camera.position, gridCenterPixelAmount);

    // Get the canvas location of where the grid starting point should be
    const localGridCanvasCenter = Vec3.sub(this.centerOfCanvas, offsetFromCamera);

    return localGridCanvasCenter;
  }

  /**
   * Given a position on the canvas, get the planning grid cell it would snap to
   * @param pos Position to test from
   * @returns
   */
  public getPlanningGridLocation(pos: Vec3): Vec3 {
    const gridCell = this.getSnapGridCell(pos);

    if (gridCell == null) {
      throw new Error(
        `Unable to find a planning grid location from the following canvas coordinates - X:${pos.x} Y:${pos.y}`
      );
    }

    return gridCell.planningGridLocation;
  }

  /**
   * Determines how many pixels should be between each unit/m based on camera zoom
   * @param unitsApart
   * @returns
   */
  private getPixelsBetweenLines(unitsApart = 1): number {
    const sizeOfUnitsAdjustedForCamera = this.sizeOfUnitInPixels * this.camera.position.z;
    return sizeOfUnitsAdjustedForCamera * unitsApart;
  }

  /**
   * Give a position, get the grid cell that would apply
   * @param pos
   * @returns
   */
  private getSnapGridCell(pos: Vec3): GridCell | null {
    let lastColumn: GridCell[] | null = null;

    for (const column of this.scene) {
      if (column.length == 0) {
        continue;
      }

      if (lastColumn == null) {
        lastColumn = column;
        continue;
      }

      const firstRow = column[0];

      if (firstRow.canvasLocation.x < pos.x) {
        lastColumn = column;
      }
    }

    if (lastColumn == null) {
      return null;
    }

    let foundCell: GridCell | null = null;
    for (const cell of lastColumn) {
      if (foundCell == null) {
        foundCell = cell;
        continue;
      }

      if (cell.canvasLocation.y >= pos.y) {
        break;
      }

      foundCell = cell;
    }

    return foundCell ?? null;
  }

  public printColumnNumbers(): void {
    const xVals = this.scene.map((x) => x[0]);

    xVals.forEach((cell) => {
      if (cell.planningGridLocation.x % 8 == 0) {
        this.writeText(cell.planningGridLocation.x.toLocaleString(), new Vec3(cell.canvasLocation.x + 3, 10));
      }
    });
  }

  public printRowNumbers(): void {
    const yVals = this.scene[0];

    yVals.forEach((cell) => {
      if (cell.planningGridLocation.y % 8 == 0) {
        this.writeText(cell.planningGridLocation.y.toLocaleString(), new Vec3(2, cell.canvasLocation.y - 2), '#c3a6ff');
      }
    });
  }

  private renderSelectedBuildable() {
    if (!this.currentlySelectedItem) {
      return;
    }
    this.drawPlacedItem(this.currentlySelectedItem, 0.5);
  }

  /**
   * Renders the current scene onto the canvas
   */
  public render(): void {
    this.clear();
    this.buildScene();
    this.drawGrid(1, '#2f3b54');
    this.drawGrid(8, '#8695b7');
    this.printColumnNumbers();
    this.printRowNumbers();

    this.showPlacedItemsInScene();
    this.renderSelectedBuildable();
  }

  private showPlacedItemsInScene(): void {
    const placedBuildables = this.planningGrid.getAllInArea(this.planningGridBounds);

    placedBuildables.forEach((item) => this.drawPlacedItem(item));
  }

  private writeText(text: string, position: Vec3, color = '#bae67e') {
    this.context.fillStyle = color;
    this.context.fillText(text, position.x, position.y);
  }
}
