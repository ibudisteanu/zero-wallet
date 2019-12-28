import HomePage from 'src/pages/home/home.page';
const LoginPage = () => import('src/pages/login/login.page');


const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    }
];

export default routes;