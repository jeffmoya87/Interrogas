import { lazy } from 'react';
import PublicPage from '../components/public/PublicPage';
import Login from '../components/account/authRoutes';
const Landing = lazy(() => import('../pages/landing/'));
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));
const ServerError = lazy(() => import('../pages/error/ServerError'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('../pages/CookiePolicy'));
const MultipleLineChart = lazy(() => import('../components/charts/MultipleLineChart'));

const routes = [
    {
        path: '/',
        name: 'Landing',
        exact: true,
        element: Landing,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/privacy-policy',
        name: 'PrivacyPolicy',
        exact: true,
        element: PrivacyPolicy,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/cookie-policy',
        name: 'CookiePolicy',
        exact: true,
        element: CookiePolicy,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const contactRoute = [
   
    {
        path: '/public',
        name: 'PublicPage',
        exact: true,
        element: PublicPage,
        roles: [],
        isAnonymous: true,
        isSimple: false,
    },
];

const errorRoutes = [
    {
        path: '/error-500',
        name: 'Error - 500',
        element: ServerError,
        roles: [],
        exact: true,
        isAnonymous: true,
        isSimple: false,
    },
    {
        path: '/error-404',
        name: 'Error - 404',
        element: PageNotFound,
        roles: [],
        exact: true,
        isAnonymous: true,
        isSimple: false,
    },
];

const authentication = [
    {
        path: '/login',
        name: 'Login',
        exact: true,
        element: Login,
        roles: [],
        isAnonymous: true,
        isSimple: true,
    },
    
];

const chart = [
    {
        path: '/multipleLineChart',
        name: 'MultipleLineChart',
        exact: true,
        element: MultipleLineChart,
        roles: [],
        isAnonymous: true,
    },
    
];

var allRoutes = [...routes, ...errorRoutes, ...authentication, ...contactRoute, ...chart,...blogs,...faqs];

export default allRoutes;
