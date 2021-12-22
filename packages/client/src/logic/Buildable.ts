/**
 * A buildable item inside of Satisfactory, something that can be selected from the Build Menu in game and placed
 */
export interface Buildable {
  displayOrder: number;
  groupName: string;
  height: number;
  imageName: string | null;
  length: number;
  name: string;
  tab: string | null;
  width: number;
}
