import { Vec3 } from "./Vec3";

export interface GridCell {
  canvasLocation: Vec3;
  localGridLocation: Vec3;
  planningGridLocation: Vec3;
}
