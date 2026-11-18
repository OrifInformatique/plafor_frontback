/** @type { import('@storybook/react').Preview } */
// Same setup as src/index.js: translations first, then the component
// library styles, then the app styles (so the app can override the library).
import "../src/i18n";
import "@orif-informatique/react-components-library/styles.css";
import "../src/index.pcss";

const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;