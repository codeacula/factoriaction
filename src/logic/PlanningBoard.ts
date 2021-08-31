export class PlanningBoard {
  constructor(canvas: HTMLCanvasElement) {
    this.providedCanvas = canvas;

    console.log("Canvas initialized", this.providedCanvas);
  }

  private providedCanvas: HTMLCanvasElement;
}
