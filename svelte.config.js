import preprocess from 'svelte-preprocess';
import netlify from '@sveltejs/adapter-netlify';
import precompileIntl from "svelte-intl-precompile/sveltekit-plugin.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: netlify(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
		vite: {
			plugins: [
				precompileIntl('locales') // if your translations are defined in /locales/[lang].json
			],
      ssr: {
        external: ['@babel/core', 'babel-plugin-precompile-intl']
      }
		}
  },
};

export default config;
