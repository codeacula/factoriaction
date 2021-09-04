import { GridCamera } from "./GridCamera";
import { PlanningGrid } from "./PlanningGrid";
import { Vec3 } from "./Vec3";

export class GridRenderer {
  constructor(
    canvas: HTMLCanvasElement,
    grid: PlanningGrid,
    camera: GridCamera
  ) {
    this.camera = camera;
    this.canvas = canvas;
    this.grid = grid;

    const drawingContext = this.canvas.getContext("2d", {
      alpha: true,
    });

    if (!drawingContext) {
      throw new Error(
        "Unable to get a drawing context from the provided canvas"
      );
    }

    this.context = drawingContext;
    this.context.font = `16px "Roboto Mono"`;
  }

  private camera: GridCamera;
  private canvas: HTMLCanvasElement;
  private centerOfCanvas: Vec3 = new Vec3();
  private context: CanvasRenderingContext2D;

  // We have to offset the draw by 0.5 so that we get correct pixel sizes
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#a_linewidth_example
  private drawOffset = 0.5;
  private grid: PlanningGrid;

  // Decides how many pixels should be between grid lines on a standard, unzoomed view
  private sizeOfUnitInPixels = 15;

  /**
   * Determine where on the canvas (0, 0) should be if the camera was dead center
   */
  public calculateDeadCenter(): void {
    const halfX = Math.floor(this.canvas.width / 2);
    const halfY = Math.floor(this.canvas.height / 2);
    this.centerOfCanvas = new Vec3(halfX, halfY);
  }

  /**
   * Given an X position on the canvas, determine what column number it would be, taking into account any movement from
   * the camera
   * @param xpos
   * @returns
   */
  private canvasPositionToColumnNumber(xpos: number): number {
    const gridSize = this.getPixelsBetweenLines(1);
    let distanceFromCenter = Math.floor(xpos) - this.canvas.width / 2;
    distanceFromCenter += this.camera.position.x;

    return distanceFromCenter / gridSize;
  }

  /**
   * Given a Y position on the canvas, determin what row number it would be, taking into account any movement from the
   * camera
   * @param ypos
   * @returns
   */
  private canvasPositionToRowNumber(ypos: number): number {
    const gridSize = this.getPixelsBetweenLines(1);
    let distanceFromCenter =
      Math.floor(ypos) - Math.floor(this.canvas.height / 2);
    distanceFromCenter += this.camera.position.y;

    return distanceFromCenter / gridSize;
  }

  /**
   * Clear the drawing canvas
   */
  private clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws a grid across the X and Y axis
   * @param unitsApart How many Satisfactory units (m's) should be between each line
   * @param color What color to paint the line
   */
  private drawGrid(unitsApart: number, color: string) {
    const pixelsBetweenLines = this.getPixelsBetweenLines(unitsApart);

    this.drawXGrid(pixelsBetweenLines, color);
    this.drawYGrid(pixelsBetweenLines, color);
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
    // This offset allows us to draw the grid like the user would expect, otherwise it would always be aligned to the left
    const canvasGridOffset = this.getCanvasXOffset(unitsApart);

    const columnsToDraw = Math.ceil(this.canvas.width / unitsApart);

    for (let i = 0; i <= columnsToDraw; ++i) {
      let xcoord = unitsApart * i + canvasGridOffset;
      xcoord += Number.isInteger(xcoord) ? this.drawOffset : 0;

      this.drawLine(
        new Vec3(xcoord, 0),
        new Vec3(xcoord, this.canvas.height),
        color
      );
    }
  }

  /**
   * Draws the grid on the Y-axis
   * @param unitsApart How far apart in pixels each column should be
   * @param color What color should the line be
   */
  private drawYGrid(unitsApart: number, color: string) {
    const rowsToDraw = Math.ceil(this.canvas.height / unitsApart);

    // This offset allows us to draw the grid like the user would expect, otherwise it would always be aligned to the left
    const canvasGridOffset = this.getCanvasYOffset(unitsApart);

    for (let i = 0; i <= rowsToDraw; ++i) {
      let ycoord = unitsApart * i + canvasGridOffset;
      ycoord += Number.isInteger(ycoord) ? this.drawOffset : 0;

      this.drawLine(
        new Vec3(0, ycoord),
        new Vec3(this.canvas.width, ycoord),
        color
      );
    }
  }

  private getCanvasXOffset(unitsApart = 1): number {
    const cameraX = this.camera.position.x;

    // We need half of the width because the center of the camera is in the middle of the canvas
    const halfWidthOfCanvas = this.canvas.width / 2 - cameraX;

    // This offset allows us to draw the grid like the user would expect, otherwise it would always be aligned to the left
    return (halfWidthOfCanvas + cameraX * unitsApart) % unitsApart;
  }

  private getCanvasYOffset(unitsApart = 1): number {
    const cameraY = this.camera.position.y;

    // We need half of the width because the center of the camera is in the middle of the canvas
    const halfWidthOfCanvas = this.canvas.height / 2 - cameraY;

    // This offset allows us to draw the grid like the user would expect, otherwise it would always be aligned to the left
    return (halfWidthOfCanvas + cameraY * unitsApart) % unitsApart;
  }

  private getPixelsBetweenLines(unitsApart = 1): number {
    const sizeOfUnitsAdjustedForCamera =
      this.sizeOfUnitInPixels * this.camera.position.z;
    return sizeOfUnitsAdjustedForCamera * unitsApart;
  }

  /**
   * Given a position, find where it should snap to
   * @param xpos
   */
  private getSnapPosition(pos: Vec3): Vec3 {
    const leftSide = pos.x < this.centerOfCanvas.x;
    const xDistFromCenter = Math.abs(pos.x - this.centerOfCanvas.x);

    const xPosIndex = leftSide
      ? Math.ceil(xDistFromCenter / this.getPixelsBetweenLines())
      : Math.floor(xDistFromCenter / this.getPixelsBetweenLines());
    const xDiff =
      xPosIndex * this.getPixelsBetweenLines() + this.getCanvasXOffset();
    const xPos = leftSide
      ? this.canvas.width / 2 - xDiff
      : this.canvas.width / 2 + xDiff;

    const topSide = pos.y < this.centerOfCanvas.y;
    const yDistFromCenter = Math.abs(pos.y - this.centerOfCanvas.y);

    const yPosIndex = topSide
      ? Math.ceil(yDistFromCenter / this.getPixelsBetweenLines())
      : Math.floor(yDistFromCenter / this.getPixelsBetweenLines());
    const yDiff =
      yPosIndex * this.getPixelsBetweenLines() + this.getCanvasYOffset();
    const yPos = topSide
      ? this.canvas.height / 2 - yDiff
      : this.canvas.height / 2 + yDiff;

    return new Vec3(xPos, yPos);
  }

  public printColumnNumbers(): void {
    const unitsApart = this.getPixelsBetweenLines(8);

    // This offset allows us to draw the grid like the user would expect, otherwise it would always be aligned to the left
    const canvasGridOffset = this.getCanvasXOffset(unitsApart);
    const columnsToDraw = Math.ceil(this.canvas.width / unitsApart);

    for (let i = 0; i <= columnsToDraw; ++i) {
      let xpos = unitsApart * i + canvasGridOffset;
      xpos += Number.isInteger(xpos) ? this.drawOffset : 0;
      this.writeText(
        this.canvasPositionToColumnNumber(xpos).toLocaleString(),
        new Vec3(xpos + 3, 10)
      );
    }
  }

  public printRowNumbers(): void {
    const unitsApart = this.getPixelsBetweenLines(8);

    // This offset allows us to draw the grid like the user would expect, otherwise it would always be aligned to the left
    const canvasGridOffset = this.getCanvasYOffset(unitsApart);
    const rowsToDraw = Math.ceil(this.canvas.height / unitsApart);

    for (let i = 0; i <= rowsToDraw; ++i) {
      let ypos = unitsApart * i + canvasGridOffset;
      ypos += Number.isInteger(ypos) ? this.drawOffset : 0;
      this.writeText(
        this.canvasPositionToRowNumber(ypos).toLocaleString(),
        new Vec3(2, ypos - 2),
        "#c3a6ff"
      );
    }
  }

  private renderSelectedBuildable(image: CanvasImageSource, coords: Vec3) {
    const snapPos = this.getSnapPosition(coords);

    this.context.drawImage(
      image,
      snapPos.x,
      snapPos.y,
      (image.width as number) * this.camera.z,
      (image.height as number) * this.camera.z
    );
  }

  /**
   * Renders the current scene onto the canvas
   */
  public render(image?: CanvasImageSource, coords?: Vec3): void {
    this.clear();
    this.drawGrid(1, "#2f3b54");
    this.drawGrid(8, "#8695b7");
    this.printColumnNumbers();
    this.printRowNumbers();

    if (image && coords) {
      this.renderSelectedBuildable(image, coords);
    }
  }

  private writeText(text: string, position: Vec3, color = "#bae67e") {
    this.context.fillStyle = color;
    this.context.fillText(text, position.x, position.y);
  }
}
