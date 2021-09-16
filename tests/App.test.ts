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

  it('shows and closes the help menu', async () => {
    const helpMenuComponent = instance.findComponent(HelpMenu);
    expect(helpMenuComponent.isVisible()).toBeFalsy();

    const helpMenuLink = instance.get('.show-help-menu');
    await helpMenuLink.trigger('click');

    expect(helpMenuComponent.isVisible()).toBeTruthy();

    await helpMenuComponent.vm.$emit('close');

    expect(helpMenuComponent.isVisible()).toBeFalsy();
  });

  it('sends a keyboard event when you press the build menu button in the nav', () => {
    jest.spyOn(window, 'dispatchEvent');

    const helpMenuLink = instance.get('.show-build-menu');
    helpMenuLink.trigger('click');

    expect(window.dispatchEvent).toHaveBeenCalledWith(new KeyboardEvent('keydown', { key: 'q' }));
  });
});
