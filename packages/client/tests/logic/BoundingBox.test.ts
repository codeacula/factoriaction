import { Vec3 } from '@/logic';
import { BoundingBox } from '@/logic/BoundingBox';

describe('BoundingBox', () => {
  describe('contains', () => {
    const mainBB = new BoundingBox(new Vec3(0, 0, 0), new Vec3(10, 10, 0));

    it('contains the provided vec3', () => {
      expect(mainBB.contains(new Vec3(5, 5, 0))).toBeTruthy();
    });

    it("doesn't contain the provided vec3", () => {
      expect(mainBB.contains(new Vec3(-1, -1, 0))).toBeFalsy();
    });

    it("doesn't contain the provided vec3 even if one axis is in", () => {
      expect(mainBB.contains(new Vec3(-1, 1, 0))).toBeFalsy();
    });
  });

  describe('equal', () => {
    const mainBB = new BoundingBox(new Vec3(0, 0, 0), new Vec3(10, 10, 0));
    it('is equal', () => {
      const testBB = new BoundingBox(new Vec3(0, 0, 0), new Vec3(10, 10, 0));
      expect(mainBB.equal(testBB)).toBeTruthy();
    });

    it('from x is off', () => {
      const testBB = new BoundingBox(new Vec3(1, 0, 0), new Vec3(10, 10, 0));
      expect(mainBB.equal(testBB)).toBeFalsy();
    });

    it('from y is off', () => {
      const testBB = new BoundingBox(new Vec3(0, 1, 0), new Vec3(10, 10, 0));
      expect(mainBB.equal(testBB)).toBeFalsy();
    });

    it('to x is off', () => {
      const testBB = new BoundingBox(new Vec3(0, 0, 0), new Vec3(9, 10, 0));
      expect(mainBB.equal(testBB)).toBeFalsy();
    });

    it('to y is off', () => {
      const testBB = new BoundingBox(new Vec3(0, 0, 0), new Vec3(10, 11, 0));
      expect(mainBB.equal(testBB)).toBeFalsy();
    });
  });

  it('fromSize provides correct bounding box', () => {
    // Starting at (1, 2, 3) and translating (3, 5, 7) should give an endpoint of (4, 7, 10)
    const newBB = BoundingBox.fromSize(new Vec3(1, 2, 3), new Vec3(3, 5, 7));
    expect(newBB.equal(new BoundingBox(new Vec3(1, 2, 3), new Vec3(4, 7, 10))));
  });

  describe('touches', () => {
    const testBB = new BoundingBox(new Vec3(0, 0, 0), new Vec3(10, 10, 0));

    it('touches nw corner', () => {
      expect(testBB.touches(new BoundingBox(new Vec3(-2, -2, 0), new Vec3(2, 2, 0)))).toBeTruthy();
    });

    it('touches ne corner', () => {
      expect(testBB.touches(new BoundingBox(new Vec3(8, -2, 0), new Vec3(12, 2, 0)))).toBeTruthy();
    });

    it('touches sw corner', () => {
      expect(testBB.touches(new BoundingBox(new Vec3(-2, 8, 0), new Vec3(2, 12, 0)))).toBeTruthy();
    });

    it('touches se corner', () => {
      expect(testBB.touches(new BoundingBox(new Vec3(8, 8, 0), new Vec3(12, 12, 0)))).toBeTruthy();
    });

    it("doesn't touch at all", () => {
      expect(testBB.touches(new BoundingBox(new Vec3(-8, -8, 0), new Vec3(-12, -12, 0)))).toBeFalsy();
    });
  });
});
