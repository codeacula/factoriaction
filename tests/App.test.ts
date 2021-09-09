import { mount, VueWrapper } from '@vue/test-utils';
import router from '@/router';
import App from '@/App.vue';
import HelpMenu from '@/components/HelpMenu.vue';

jest.mock('@/views/Home.vue');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let instance: VueWrapper<any>;

describe('App.vue', () => {
  beforeAll(async () => {
    router.push('/');
    await router.isReady();
  });

  beforeEach(async () => {
    instance = mount(App, { global: { plugins: [router] } });
  });

  it('shows the help menu', () => {
    const component = instance.getComponent(HelpMenu);
    expect(component.isVisible()).toBeFalsy();

    const buildMenuLink = instance.get('.show-build-menu');
    buildMenuLink.trigger('click');

    expect(component.isVisible()).toBeTruthy();
  });
});
