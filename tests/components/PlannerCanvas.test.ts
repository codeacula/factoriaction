import { mount, VueWrapper } from '@vue/test-utils';
import BuildMenu from '@/components/BuildMenu.vue';
import PlannerCanvas from '@/components/PlannerCanvas.vue';
import { Buildable, PlanningBoardController } from '@/logic';
import { nextTick } from 'vue';

jest.mock('@/logic/PlanningBoardController');

const pbMock = PlanningBoardController as jest.MockedClass<typeof PlanningBoardController>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: VueWrapper<any>;

function buildComponent() {
  return mount(PlannerCanvas);
}

function getLastMockInstance(): PlanningBoardController {
  return pbMock.mock.instances[pbMock.mock.instances.length - 1];
}

describe('PlannerCanvas', () => {
  describe('build menu tests', () => {
    beforeEach(() => {
      instance = buildComponent();
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
      expect(getLastMockInstance().cancelSelection).toHaveBeenCalled();
    });

    it('closes the build menu when told to by the component', async () => {
      const menuInstance = instance.getComponent(BuildMenu);
      menuInstance.vm.$emit('close');

      await nextTick();
      expect(menuInstance.isVisible()).toBeFalsy();
    });

    it('closes the build menu when a buildable is selected', async () => {
      const buildable = {} as Buildable;
      const menuInstance = instance.getComponent(BuildMenu);
      menuInstance.vm.$emit('buildable-selected', buildable);

      await nextTick();
      expect(menuInstance.isVisible()).toBeFalsy();
    });

    it('selects the buildable provided by the BuildMenu emit', () => {
      const buildable = {} as Buildable;
      const menuInstance = instance.getComponent(BuildMenu);
      menuInstance.vm.$emit('buildable-selected', buildable);

      expect(getLastMockInstance().selectBuildable).toHaveBeenCalledWith(buildable);
    });
  });
});
