/** @type { import('@storybook/react').Preview } */
import "../src/index.pcss";
import "../src/i18n";

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