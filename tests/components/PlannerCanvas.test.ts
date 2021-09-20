import { mount, VueWrapper } from '@vue/test-utils';
import BuildMenu from '@/components/BuildMenu.vue';
import PlannerCanvas from '@/components/PlannerCanvas.vue';
import { PlanningBoardController } from '@/logic';
import { nextTick } from 'vue';

jest.mock('@/logic/PlanningBoardController');

const pbMock = PlanningBoardController as jest.Mocked<typeof PlanningBoardController>;
const pbService = pbMock.de

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: VueWrapper<any>;

function buildComponent() {
  return mount(PlannerCanvas);
}

describe('PlannerCanvas', () => {
  describe('build menu tests', () => {
    beforeEach(() => {
      instance = buildComponent();
      pbMock.
    });

    it('shows the build menu when the users presses q', async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
      const menuInstance = instance.getComponent(BuildMenu);
      await nextTick();
      expect(menuInstance.isVisible()).toBeTruthy();
    });

    it("does nothing once everything's been unmounted", async () => {
      instance.unmount();
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
      const menuInstance = instance.getComponent(BuildMenu);
      await nextTick();
      expect(menuInstance.isVisible()).toBeFalsy();
    });

    it("doesn't show the menu if it's not q", async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
      const menuInstance = instance.getComponent(BuildMenu);
      await nextTick();
      expect(menuInstance.isVisible()).toBeFalsy();
    });

    it('cancels the current selection when q is pressed', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
      console.log(pbMock);
    });
  });
});
