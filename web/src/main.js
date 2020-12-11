import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Index from '/@/pages/index.vue';
import Docs from '/@/pages/docs.vue';
import About from '/@/pages/about.vue';
import ProjectIcons from '/@/pages/icons.vue';
import SearchResult from '/@/pages/search-result.vue';
import IconDetail from '/@/pages/icon-detail.vue';
import Svgs from '/@/assets/js/svgs.js';
import App from './App.vue';
import './index.scss';

const _fetch = window.fetch;
const host = location.host.includes('.com') ? '' : '';
window.fetch = function(url, options) {
  if (!url.includes('npm-registry')) {
    url = host + url;
  }
  return _fetch(url, options);
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Index },
    { path: '/about', component: About },
    { path: '/docs', component: Docs},
    { path: '/search', component: SearchResult },
    { path: '/:alias', component: ProjectIcons },
    { path: '/:alias/:id', component: IconDetail }
  ]
});

const app = createApp(App);

app.config.globalProperties.host = host;
app.use(VueSvgIcons, {
  classPrefix: 'vue',
  tagName: 'vue-icon',
  svgIcons: Svgs
});
app.use(router);
app.mount('#app');
