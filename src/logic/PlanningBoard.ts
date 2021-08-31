export class PlanningBoard {
  constructor(canvas: HTMLCanvasElement) {
    this.providedCanvas = canvas;
    const drawingContext = this.providedCanvas.getContext("2d");

    if (drawingContext == null) {
      throw new Error("Unable to get a 2d drawing context from the canvas");
    }

    const parent = this.providedCanvas.parentElement;

    if (parent) {
      this.providedCanvas.width = parent.clientWidth;
      this.providedCanvas.height = parent.clientHeight;
    }

    this.drawingContext = drawingContext;

    this.providedCanvas.addEventListener("wheel", (ev: WheelEvent) => {
      if (ev.deltaY < 0) {
        this.currentScale += this.scaleSteps;
      } else {
        this.currentScale -= this.scaleSteps;
      }

      this.drawGrid();
    });
    this.drawGrid();
  }

  private currentScale = 1;
  private drawingContext: CanvasRenderingContext2D;
  private gridGap = 10;
  private providedCanvas: HTMLCanvasElement;
  private scaleSteps = 0.5;

  private drawGrid() {
    const gridSpace = this.gridGap * this.currentScale;
    const columns = this.providedCanvas.width / gridSpace;
    const rows = this.providedCanvas.height / gridSpace;

    this.drawingContext.clearRect(
      0,
      0,
      this.providedCanvas.width,
      this.providedCanvas.height
    );

    for (let i = 0; i < columns; i++) {
      this.drawingContext.beginPath();
      this.drawingContext.lineWidth = 1;
      this.drawingContext.strokeStyle = "#2f3b54";
      this.drawingContext.moveTo(gridSpace * i, 0);
      this.drawingContext.lineTo(gridSpace * i, this.providedCanvas.height);
      this.drawingContext.stroke();
    }

    for (let i = 0; i < rows; i++) {
      this.drawingContext.beginPath();
      this.drawingContext.lineWidth = 1;
      this.drawingContext.strokeStyle = "#2f3b54";
      this.drawingContext.moveTo(0, gridSpace * i);
      this.drawingContext.lineTo(this.providedCanvas.width, gridSpace * i);
      this.drawingContext.stroke();
    }
  }
}
