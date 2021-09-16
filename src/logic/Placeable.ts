import { Buildable, Vec3 } from '.';
import { Rotation } from './Rotation';

export interface Placeable {
  buildable: Buildable;
  image: CanvasImageSource;
  position: Vec3;
  rotation: Rotation;
}
