// Import Vue
import Vue from 'vue/dist/vue.min';

// Import Vue App, routes, store
import App from './app';

export default (params)=> {

    new Vue({
        el: '#app',
        render: (createElement) => {

            const app = createElement(App, {
                props: {
                    startAutomatically: params.startAutomatically,
                }
            });

            return app;

        }
    });


}