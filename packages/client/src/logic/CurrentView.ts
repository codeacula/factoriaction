import { BoundingBox } from './BoundingBox';

export interface CurrentView {
  localGrid: BoundingBox;
  planningGrid: BoundingBox;
  virtualCanvas: BoundingBox;
}
