import { Buildable, Vec3 } from '.';

export interface Placeable {
  buildable: Buildable;
  image: CanvasImageSource;
  position: Vec3;
}
