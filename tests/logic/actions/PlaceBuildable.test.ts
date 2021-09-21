import { Placeable, PlaceBuildable, Vec3 } from '@/logic';
import { Rotation } from '@/logic/Rotation';

import { GridCamera } from '@/logic/GridCamera';
import { GridRenderer } from '@/logic/GridRenderer';
import { PlanningGrid } from '@/logic/PlanningGrid';
jest.mock('@/logic/GridCamera');
jest.mock('@/logic/GridRenderer');
jest.mock('@/logic/PlanningGrid');

describe('PlaceBuildable', () => {
  const placeable = {
    buildable: {
      displayOrder: 0,
      groupName: '',
      height: 0,
      imageName: '',
      length: 0,
      name: '',
      tab: '',
      width: 0,
    },
    image: new Image(),
    position: new Vec3(),
    rotation: Rotation.Down,
  } as Placeable;

  const placeBuildableAction = new PlaceBuildable(placeable);

  const gridCamera = new GridCamera();
  const planningGrid = new PlanningGrid();
  const gridRenderer = new GridRenderer(document.createElement('canvas'), gridCamera, planningGrid);
  const injectable = { gridCamera, planningGrid, gridRenderer };

  it('calls to place on the planning grid when committed', () => {
    placeBuildableAction.commit(injectable);
    expect(planningGrid.place).toHaveBeenCalledWith(placeable);
  });

  it('calls to remove on the planning grid when reverted', () => {
    placeBuildableAction.revert(injectable);
    expect(planningGrid.remove).toHaveBeenCalledWith(placeable);
  });
});
