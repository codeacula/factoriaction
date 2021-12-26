import { mount, VueWrapper } from '@vue/test-utils';
import BuildableItemButton from '@/components/BuildableItemButton.vue';

function buildComponent() {
  // Satisfies the prop requirement.
  const testItem = {
    displayOrder: -1,
    groupName: 'testGroup',
    height: -1,
    imageName: null,
    length: -1,
    name: 'ArbitraryName',
    tab: null,
    width: -1,
  };

  return mount(BuildableItemButton, {
    props: {
      item: testItem,
    }
  });
}

describe('BuildableItemButton', () => {
  it('Button is Clicked', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance: VueWrapper<any> = buildComponent();

    const component = instance.getComponent(BuildableItemButton);
    component.trigger('click');
    expect(instance.emitted()).toHaveProperty('click');
  });
})