# vue-axios-client

Reusable Axios client for Vue 3 applications.

Provides:

* Axios instance configuration
* Development/production API URLs
* Django CSRF support
* `withCredentials`
* Centralized error handling
* Success and error toast notifications
* Global loading overlay
* TypeScript support

## Requirements

* Vue 3
* Axios 1.x
* Vite

Vue and Axios are peer dependencies.

## Installation

```bash
npm install github:Leonardo-Bo/vue-axios-client
```

Import the client:

```ts
import {
    configureAxios,
    useAxios,
    handleAxiosError,
} from 'vue-axios-client';
```

## Configuration

Configure Axios once in `main.ts`:

```ts
configureAxios({
    productionUrl: 'https://api.example.com',
});
```

Development defaults to:

```text
http://127.0.0.1:8000
```

Use the configured client anywhere:

```ts
const axios = useAxios();

await axios.get('/api/session/');
```

## CSRF

For non-GET requests, the client automatically reads the Django `csrftoken` cookie and sends:

```http
X-CSRFToken: <token>
```

Requests use:

```ts
withCredentials: true
```

## Error handling

```ts
try {
    await axios.post('/api/login/', data);
} catch (error) {
    handleAxiosError(error);
}
```

API errors are automatically displayed as danger toasts.

Errors can also be collected:

```ts
const errors: string[] = [];

try {
    await axios.post('/api/login/', data);
} catch (error) {
    handleAxiosError(error, errors);
}
```

## Success toasts

Success toasts are opt-in per request:

```ts
await axios.post(
    '/api/drugs/',
    { name },
    {
        successToast: 'Drug created successfully.',
    },
);
```

## Loading overlay

The package automatically manages the global Axios loading state.

Place the component once, usually in `App.vue`; it shows itself while requests are pending:

```vue
<script setup lang="ts">
import { LoadingOverlay } from 'vue-axios-client';
</script>

<template>
    <LoadingOverlay />
</template>
```

The loading state is also available as a ref:

```ts
import { useAxiosLoading } from 'vue-axios-client';

const isLoading = useAxiosLoading();
```

## Toasts

The package has its own toasts, with no external dependency. Import the stylesheet once:

```css
@import "vue-axios-client/style.css";
```

They are used by `handleAxiosError` and `successToast`, and can be shown directly:

```ts
import {
    showToast,
    showSuccessToast,
    showDangerToast,
    showWarningToast,
    showInfoToast,
} from 'vue-axios-client';

showSuccessToast('Saved.');
showToast('Kept until closed', { type: 'info', timeout: 0 });
```

- Bottom right; success, warning and info close after 3 s, errors after 5 s.
- The countdown pauses while the pointer is over a toast; every toast has a close button.
- Messages are inserted as text, never as HTML.
- Errors are announced to screen readers immediately (`role="alert"`), the others politely.
- Colours and shape come from CSS variables that the application can redefine:
  `--vac-toast-success`, `--vac-toast-danger`, `--vac-toast-warning`, `--vac-toast-info`,
  `--vac-toast-default`, `--vac-toast-text`, `--vac-toast-radius`, `--vac-toast-font`.

### From 1.x

2.0 removes `mosha-vue-toastify`. `vue-axios-client/style.css` no longer contains its styles:
an application that also calls `createToast` from `mosha-vue-toastify` directly must import
`mosha-vue-toastify/dist/style.css` itself, or switch to the functions above.

## Development

Build the package with:

```bash
npm install
npm run build
```

The compiled package is generated in `dist/`. Installing from GitHub builds it
automatically (`prepare` script).

Tests:

```bash
npm test
```

## Release workflow

```text
modify source
    ↓
npm run build
    ↓
test in application
    ↓
git commit
    ↓
git push
```

A specific Git tag can be installed with:

```bash
npm install github:Leonardo-Bo/vue-axios-client#v2.0.0
```

## License

MIT
