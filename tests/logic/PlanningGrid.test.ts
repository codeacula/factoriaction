import { BoundingBox } from '@/logic/BoundingBox';
import { Buildable } from '@/logic/Buildable';
import { Placeable } from '@/logic/Placeable';
import { PlacedItem } from '@/logic';
import { PlanningGrid } from '@/logic/PlanningGrid';
import { Rotation } from '@/logic/Rotation';
import { Tabs } from '@/components/Tabs';
import { Vec3 } from '@/logic/Vec3';

const testPlanningGrid = new PlanningGrid();

const testBuildableArr: Array<Buildable> = [
  {
    name: 'Assembler',
    width: 10,
    length: 15,
    height: 10,
    tab: Tabs.production,
    displayOrder: 1,
    imageName: null,
    groupName: '2. Manufacturers',
  },
  {
    name: 'AWESOME Shop',
    width: 4,
    length: 6,
    height: 5,
    tab: Tabs.special,
    displayOrder: 5,
    imageName: null,
    groupName: '1. Special',
  },
];

const image = new Image();
image.src = '/img/icons/surprise_pikachu.png';

const testPlaceableArr: Array<Placeable> = [
  {
    buildable: testBuildableArr[0],
    image: image,
    position: new Vec3(0, 0, 0),
    rotation: Rotation.Up,
  },
  {
    buildable: testBuildableArr[1],
    image: image,
    position: new Vec3(500, 500, 0),
    rotation: Rotation.Up,
  },
];


describe('PlanningGrid', () => {
  it('insert two items into a planning grid', () => {
    for (let i = 0; i < testPlaceableArr.length; ++i) {
      testPlanningGrid.place(testPlaceableArr[i]);
    }

    const bb = new BoundingBox(new Vec3(0, 0, 0), new Vec3(500, 500, 0));
    const items: Array<PlacedItem> = testPlanningGrid.getAllInArea(bb);
    expect(items.length === 2).toBeTruthy();
  });

  it('get all items in a specific area', () => {
    const bb = new BoundingBox(new Vec3(400, 400, 0), new Vec3(500, 500, 0));
    const items: Array<PlacedItem> = testPlanningGrid.getAllInArea(bb);
    expect(items[0].equal(testPlaceableArr[1])).toBeTruthy();
  });

  it('grab the last item in planning grid', () => {
    const item: PlacedItem = testPlanningGrid.getLastItem();
    expect(item.equal(testPlaceableArr[testPlaceableArr.length - 1])).toBeTruthy();
  });

  it('remove all items from planning grid', () => {
    for (let i = 0; i < testPlaceableArr.length; ++i) {
      testPlanningGrid.remove(testPlaceableArr[i]);
    }

    const bb = new BoundingBox(new Vec3(0, 0, 0), new Vec3(500, 500, 0));
    const items: Array<PlacedItem> = testPlanningGrid.getAllInArea(bb);
    expect(items.length === 0).toBeTruthy();
  });
});
