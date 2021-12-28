import { GridCamera, Vec3 } from '@/logic';

describe('GridCamera', () => {
  let camera = new GridCamera();

  beforeEach(() => {
    camera = new GridCamera();
  });

  describe('movement functions', () => {
    it('moves along +y when forward is called', () => {
      camera.forward();
      expect(camera.position).toEqual(new Vec3(0, 0.5, 1));
    });

    it('moves along -y when back is called', () => {
      camera.back();
      expect(camera.position).toEqual(new Vec3(0, -0.5, 1));
    });

    it('moves along +x when right is called', () => {
      camera.right();
      expect(camera.position).toEqual(new Vec3(0.5, 0, 1));
    });

    it('moves along -x when left is called', () => {
      camera.left();
      expect(camera.position).toEqual(new Vec3(-0.5, 0, 1));
    });

    it('moves along -z when up is called', () => {
      camera.down();
      expect(camera.position).toEqual(new Vec3(0, 0, 0.5));
    });

    it('moves along +z when down is called', () => {
      camera.up();
      expect(camera.position).toEqual(new Vec3(0, 0, 1.5));
    });

    it("doesn't allow the camera to break through the floor", () => {
      for (let i = 0; i < 100; i++) {
        camera.down();
      }
      expect(camera.position).toEqual(new Vec3(0, 0, 0.5));
    });

    it("doesn't allow the camera to break through the ceiling", () => {
      for (let i = 0; i < 100; i++) {
        camera.up();
      }
      expect(camera.position).toEqual(new Vec3(0, 0, 6));
    });
  });

  describe('dragging event handlers', () => {
    it('moves the virtual canvas correctly when user drags in different locations, positive direction', () => {
      const dragStart = new Vec3(234, 134, 0);
      camera.startDragging(dragStart);
      camera.mouseDragged(new Vec3(15, 42, 0));
      camera.mouseDragged(new Vec3(153, 23, 0));

      expect(camera.position).toEqual(new Vec3(81, 111, expect.any(Number)));
    });

    it('moves the virtual canvas correctly when user drags in different locations, negative direction', () => {
      const dragStart = new Vec3(153, 23, 0);
      camera.startDragging(dragStart);
      camera.mouseDragged(new Vec3(15, 42, 0));
      camera.mouseDragged(new Vec3(234, 134, 0));

      expect(camera.position).toEqual(new Vec3(-81, -111, expect.any(Number)));
    });
  });

  describe('currentView', () => {
    describe('before movement', () => {
      beforeEach(() => {
        camera.canvasDimensions = new Vec3(300, 150);
      });

      it('provides the right virtual canvas before', () => {
        expect(camera.currentView.virtualCanvas.from).toEqual(new Vec3(-150, -75, expect.any(Number)));
        expect(camera.currentView.virtualCanvas.to).toEqual(new Vec3(150, 75, expect.any(Number)));
      });

      it('provides the right local grid before', () => {
        expect(camera.currentView.localGrid.from).toEqual(new Vec3(-10, -5, expect.any(Number)));
        expect(camera.currentView.localGrid.to).toEqual(new Vec3(10, 5, expect.any(Number)));
      });

      it('provides the right planning grid before', () => {
        expect(camera.currentView.planningGrid.from).toEqual(new Vec3(-10, -5, expect.any(Number)));
        expect(camera.currentView.planningGrid.to).toEqual(new Vec3(10, 5, expect.any(Number)));
      });
    });

    describe('after movement', () => {
      beforeEach(() => {
        camera.canvasDimensions = new Vec3(300, 150);

        const dragStart = new Vec3(153, 23, 0);
        camera.startDragging(dragStart);
        camera.mouseDragged(new Vec3(234, 134, 0));
      });

      it('provides the right virtual canvas after', () => {
        expect(camera.currentView.virtualCanvas.from).toEqual(new Vec3(-231, -186, expect.any(Number)));
        expect(camera.currentView.virtualCanvas.to).toEqual(new Vec3(69, -36, expect.any(Number)));
      });

      it('provides the right local grid after', () => {
        expect(camera.currentView.localGrid.from).toEqual(new Vec3(-10, -5, expect.any(Number)));
        expect(camera.currentView.localGrid.to).toEqual(new Vec3(10, 5, expect.any(Number)));
      });

      it('provides the right planning grid after', () => {
        expect(camera.currentView.planningGrid.from).toEqual(new Vec3(-16, -13, expect.any(Number)));
        expect(camera.currentView.planningGrid.to).toEqual(new Vec3(4, -3, expect.any(Number)));
      });
    });
  });
});
