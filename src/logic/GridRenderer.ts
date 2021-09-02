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
  private context: CanvasRenderingContext2D;

  // We have to offset the draw by 0.5 so that we get smaller pixel sizes
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#a_linewidth_example
  private drawOffset = 0.5;
  private grid: PlanningGrid;

  // Decides how many pixels should be between grid lines on a standard view
  private sizeOfUnitInPixels = 10;

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

  private drawLine(
    fromx: number,
    fromy: number,
    tox: number,
    toy: number,
    color: string,
    width = 1
  ) {
    this.context.beginPath();
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.moveTo(fromx, fromy);
    this.context.lineTo(tox, toy);
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
      let fromx = unitsApart * i + canvasGridOffset;
      fromx += Number.isInteger(fromx) ? this.drawOffset : 0;
      const fromy = 0;
      const tox = fromx;
      const toy = this.canvas.height;

      this.drawLine(fromx, fromy, tox, toy, color);
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
      let fromy = unitsApart * i + canvasGridOffset;
      fromy += Number.isInteger(fromy) ? this.drawOffset : 0;
      const fromx = 0;
      const toy = fromy;
      const tox = this.canvas.width;

      this.drawLine(fromx, fromy, tox, toy, color);
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

  private canvasPositionToColumnNumber(xpos: number): number {
    const gridSize = this.getPixelsBetweenLines(1);
    let distanceFromCenter = Math.floor(xpos) - this.canvas.width / 2;
    distanceFromCenter += this.camera.position.x;

    return distanceFromCenter / gridSize;
  }

  private canvasPositionToRowNumber(ypos: number): number {
    const gridSize = this.getPixelsBetweenLines(1);
    let distanceFromCenter =
      Math.floor(ypos) - Math.floor(this.canvas.height / 2);
    distanceFromCenter += this.camera.position.y;

    return distanceFromCenter / gridSize;
  }

  private getPixelsBetweenLines(unitsApart = 1): number {
    const sizeOfUnitsAdjustedForCamera =
      this.sizeOfUnitInPixels * this.camera.position.z;
    return sizeOfUnitsAdjustedForCamera * unitsApart;
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
        new Vec3(xpos, 10, 1)
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
        new Vec3(0, ypos, 1),
        "#c3a6ff"
      );
    }
  }

  /**
   * Renders the current scene onto the canvas
   */
  public render(): void {
    this.clear();
    this.drawGrid(1, "#2f3b54");
    this.drawGrid(8, "#8695b7");
    this.printColumnNumbers();
    this.printRowNumbers();
  }

  private writeText(text: string, position: Vec3, color = "#bae67e") {
    this.context.fillStyle = color;
    this.context.fillText(text, position.x, position.y);
  }
}
