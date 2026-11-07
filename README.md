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

Export the component:

```ts
import { LoadingOverlay } from 'vue-axios-client';
```

and display it in the application:

```vue
<LoadingOverlay :visible="isLoading" />
```

The loading state is available through:

```ts
import { useAxiosLoading } from 'vue-axios-client';

const { isLoading } = useAxiosLoading();
```

## Toast CSS

Import the package stylesheet once:

```css
@import "vue-axios-client/style.css";
```

## Development

Build the package with:

```bash
npm install
npm run build
```

The compiled package is generated in:

```text
dist/
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
npm install github:Leonardo-Bo/vue-axios-client#v1.0.0
```

## License

MIT
