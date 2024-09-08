// import './assets/main.css';
import './styles/index.css';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons';

import { createApp } from 'vue';
import App from './App.vue';

/* add icons to the library */
library.add(fas);

createApp(App).mount('#app');
