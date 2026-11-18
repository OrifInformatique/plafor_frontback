# Plafor : Frontend

This is the frontend of the Plafor application.

It is built with React 19, Tailwind CSS 4 and Webpack, starting from the
[Orif React project template](https://github.com/OrifInformatique/template_frontback).
It also uses React Router, Zustand, i18next (French / English) and the
`@orif-informatique/react-components-library`.

## Requirements

- Node.js 22.18 or newer (required by Babel 8 and webpack-dev-server 6)
- npm

## Configuration

The app reads its settings from a `.env` file in the `frontend` folder.
Create it by copying the template:

```sh
cp .env-template .env
```

| Variable          | Default                 | Description                                         |
| ----------------- | ----------------------- | --------------------------------------------------- |
| `PORT`            | `4000`                  | Port of the development server                      |
| `APP_ROOT`        | `/`                     | Base path the app is served from (router + assets)  |
| `BACKEND_API_URL` | `http://localhost:8081` | URL of the backend API                              |

## Run in local

1. `cd frontend`
2. `npm install`
3. `npm run serve`
4. Go to [http://localhost:4000](http://localhost:4000) (it opens automatically)

The backend must be running at `BACKEND_API_URL` for login and data loading to work.

## Storybook

1. `npm run storybook`
2. Go to [http://localhost:6006](http://localhost:6006)

To build a static version of the Storybook (in `storybook-static/`): `npm run build-storybook`

## Testing

1. `npm test`

Tests use Jest and React Testing Library. Test files are placed in `__tests__` folders next to the components.

## Building the app

1. `npm run build`

The production build is written to the `dist/` folder.

## Project structure

```
frontend/
├── public/          Static files copied as is (fonts, images, .htaccess)
├── src/
│   ├── features/    Plafor features (home, admin, layouts, progress-report, ...)
│   ├── template/    Modules coming from the template (auth, users, items)
│   ├── i18n.js      Loads every `locales/<lang>/<namespace>.json` file automatically
│   └── index.js     Entry point and routes
└── .storybook/      Storybook configuration
```
