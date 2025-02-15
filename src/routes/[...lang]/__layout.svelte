<script context="module" lang="ts">
  import { registerAll, availableLocales } from '$locales';
  import { t, waitLocale, init } from 'svelte-intl-precompile';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  registerAll();
  let defaultLang = 'en';
  let localeRegex = new RegExp(`^/(${availableLocales.join('|')})(/|$)`)
  export async function load({ page: { path } }) {
    const lang = (localeRegex.exec(path) || [null, defaultLang])[1];
    init({
      initialLocale: lang,
      fallbackLocale: defaultLang
    });
    await waitLocale()
    return {
      props: {
        lang
      }
    };
  }
</script>
<script lang="ts">
  export let lang: string
  
  const flags = import.meta.globEager('../../lib/flags/*.svg')
  
  function flagFor(lang) {
    return flags[`../../lib/flags/${lang}.svg`].default
  }

  function setLocale(code) {
    if ($page.path === '/') {
      goto('/' + code, { noscroll: true });
    } else {
      let newPath = $page.path.replace(localeRegex, '/' + code + '$2');
      if (newPath === $page.path && !localeRegex.exec($page.path)) {
        newPath = `/${code}${$page.path}`
      }
      goto(newPath, { noscroll: true })
    }
  }
</script>

<header class="fixed flex justify-between content-center bg-white shadow-lg w-screen h-14 px-8">
  <div class="flex items-center">
    <h1 class="font-bold"><a href="/">{$t('main.title')}</a></h1>
  </div>
  <div class="flex items-center">
    {#each availableLocales as locale}
    <button on:click={() => setLocale(locale)}>
      <img class="h-6 w-6 ml-2" src={flagFor(locale)} alt={locale}>
    </button>
    {/each}
    <a href={`/${lang}/docs/introduction`} class="m-2">Docs</a>
    <a href="https://github.com/cibernox/svelte-intl-precompile" class="h-6 w-6 m-2 fill-current">
      <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg>
    </a>
  </div>
</header>
<main class="pt-14 font-body leading-relaxed font-light">
  <slot />
</main>
