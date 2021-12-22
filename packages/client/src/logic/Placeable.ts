import { Buildable, Vec3 } from '.';
import { Rotation } from './Rotation';

/**
 * A builable item, along with its image and position/rotation information. These can be provided to planning grids in
 * order to be displayed/tracked
 */
export interface Placeable {
  buildable: Buildable;
  image: CanvasImageSource;
  position: Vec3;
  rotation: Rotation;
}
