import { GridCamera, GridRenderer, PlanningGrid } from ".";

export interface ActionInjectables {
  gridCamera: GridCamera;
  gridRenderer: GridRenderer;
  planningGrid: PlanningGrid;
}
