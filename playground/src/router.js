import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Device from './views/Device';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'playground',
      component: Home,
    },
    {
      path: '/device',
      name: 'device',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "deviceview" */ './views/Device.vue'),
      component: Device,
    },
  ],
});
