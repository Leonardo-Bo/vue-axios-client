import { defineComponent, h } from 'vue';

import { useAxiosLoading } from './loading.js';

/**
 * Full-screen overlay with a spinner, shown while Axios requests are pending.
 * Plain TypeScript (no .vue file), so the package needs no Vue compiler to be used or tested.
 * Styles are in style.css.
 */
export default defineComponent({
    name: 'LoadingOverlay',

    setup() {
        const isLoading = useAxiosLoading();

        return () =>
            isLoading.value
                ? h(
                      'div',
                      {
                          class: 'vac-loading-overlay',
                          role: 'status',
                          'aria-live': 'polite',
                      },
                      [h('div', { class: 'vac-loading-spinner' })],
                  )
                : null;
    },
});
