import { mount, VueWrapper } from '@vue/test-utils';
import BuildMenu from '@/components/BuildMenu.vue';
import BuildableItemButton from '@/components/BuildableItemButton.vue';
import { Buildable } from '@/logic';
import { Tabs } from '@/components/Tabs';

const buildables = [
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
] as Buildable[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: VueWrapper<any>;

function buildComponent(passedBuildables?: Buildable[]) {
  let buildablesToUse = buildables;

  if (passedBuildables) {
    buildablesToUse = passedBuildables;
  }

  return mount(BuildMenu, { props: { buildables: buildablesToUse } });
}

describe('BuildMenu', () => {
  describe('basic ui tests', () => {
    beforeEach(() => {
      instance = buildComponent();
    });

    it('selects the buildable when a buildable menu item is clicked', () => {
      const firstItem = instance.getComponent(BuildableItemButton);
      firstItem.trigger('click');
      expect(instance.emitted()).toHaveProperty('buildable-selected');
    });

    it('clicking the modal background closes build menu', () => {
      const firstItem = instance.get('.build-menu');
      firstItem.trigger('click');
      expect(instance.emitted()).toHaveProperty('close');
    });
  });

  describe('menu sorting', () => {
    it("throws an error when there's two buildables with the same sorting order", () => {
      // Vue will throw an error here because there's an unhandled exception in the code, but that's the result we want.
      // This code squelches it for this test only
      jest.spyOn(console, 'warn').mockImplementation(() => {
        return;
      });
      const testData = [
        {
          displayOrder: 1,
          groupName: 'Richard',
          tab: Tabs.transportation,
        },
        {
          displayOrder: 1,
          groupName: 'Richard',
          tab: Tabs.transportation,
        },
      ] as Buildable[];

      const wrapper = buildComponent(testData);
      const transportationTab = wrapper.find(`[data-tabtype="${Tabs.transportation}"`);

      expect(transportationTab.trigger('click')).rejects.toThrowError('Two buildables have the same displayOrder');
    });

    it("displays the section's buildables correctly", async () => {
      const testData = [
        {
          displayOrder: 1,
          groupName: 'Richard',
          name: 'Billeh',
          tab: Tabs.transportation,
        },
        {
          displayOrder: 3,
          groupName: 'Richard',
          name: 'Beetle',
          tab: Tabs.transportation,
        },
        {
          displayOrder: 2,
          groupName: 'Richard',
          name: 'ECV',
          tab: Tabs.transportation,
        },
      ] as Buildable[];

      const wrapper = buildComponent(testData);
      const transportationTab = wrapper.find(`[data-tabtype="${Tabs.transportation}"`);
      await transportationTab.trigger('click');

      const items = wrapper.findAll('.item');
      expect(items.length).toEqual(3);
      expect(items[0].attributes('data-itemname')).toEqual('Billeh');
      expect(items[1].attributes('data-itemname')).toEqual('ECV');
      expect(items[2].attributes('data-itemname')).toEqual('Beetle');
    });
  });
});
