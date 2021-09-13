import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
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

  it('shows the help menu', async () => {
    const helpMenuComponent = instance.findComponent(HelpMenu);
    expect(helpMenuComponent.isVisible()).toBeFalsy();

    const helpMenuLink = instance.get('.show-help-menu');
    helpMenuLink.trigger('click');

    await nextTick();

    expect(helpMenuComponent.isVisible()).toBeTruthy();
  });
});
