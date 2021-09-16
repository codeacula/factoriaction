import { mount, VueWrapper } from '@vue/test-utils';
import PlannerCanvas from '@/components/PlannerCanvas.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: VueWrapper<any>;

function buildComponent() {
  return mount(PlannerCanvas);
}

describe('PlannerCanvas', () => {
  it('barks', () => {
    instance = buildComponent();
    expect(instance).not.toBeNull();
  });
});
