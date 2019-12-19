import Home from 'src/pages/home';
const Medium = () => import('src/pages/medium');


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/medium',
        name: 'Medium',
        component: Medium
    }
];

export default routes;