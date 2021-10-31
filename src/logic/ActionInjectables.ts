import { GridCamera, GridRenderer, PlanningGrid } from '.';

/**
 * These are items that are provided to actions when their commit and revert methods are called
 */
export interface ActionInjectables {
  gridCamera: GridCamera;
  gridRenderer: GridRenderer;
  planningGrid: PlanningGrid;
}
