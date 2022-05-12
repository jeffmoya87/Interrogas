import { lazy } from 'react';
const PollstersExportToCSV = lazy(() => import('../components/pollsters/PollstersExportToCSV'));
const AnalyticsDashboards = lazy(() => import('../pages/dashboard/analytics/index.js'));
const CampaignDashboard = lazy(() => import('../pages/dashboard/campaign/CampaignDashboard'));
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));

const dashboardRoutes = [
    {
        path: '/dashboard/analytics',
        name: 'Analytics',
        element: AnalyticsDashboards,
        roles: ['Admin'],
        exact: true,
        isAnonymous: false,
    },

    {
        path: '/dashboard/campaign',
        name: 'Campaign',
        element: CampaignDashboard,
        exact: true,
        roles: ['Admin'],
        isAnonymous: false,
    },
    {
        path: '/dashboard',
        name: 'Dashboards',
        icon: 'uil-home-alt',
        header: 'Navigation',
        children: [
            {
                path: '/dashboard/analytics',
                name: 'Analytics',
                element: AnalyticsDashboards,
                roles: ['Admin'],
                exact: true,
                isAnonymous: false,
            },
        ],
    },
    {
        path: '/dashboard',
        name: 'Dashboards',
        icon: 'uil-home-alt',
        header: 'Navigation',
        children: [
            {
                path: '/dashboard/campaign',
                name: 'CampaignDashboard',
                element: CampaignDashboard,
                roles: ['Admin'],
                exact: true,
                isAnonymous: false,
            },
        ],
    },
];

const test = [
    {
        path: '/test',
        name: 'Test',
        exact: true,
        element: AnalyticsDashboards,
        roles: ['Fail'],
        isAnonymous: false,
    },
    {
        path: '/secured',
        name: 'A Secured Route',
        exact: true,
        element: AnalyticsDashboards,
        roles: ['Fail'],
        isAnonymous: false,
    },
    {
        path: '/secured2',
        name: 'A Secured Route',
        exact: true,
        element: AnalyticsDashboards,
        roles: ['Admin'],
        isAnonymous: false,
    },
];

const pollsters = [
    {
        path: '/pollsters',
        name: 'Pollsters',
        exact: true,
        element: Pollsters,
        roles: ['Admin', 'User'],
        isAnonymous: false,
    },

    {
        path: '/components/pollsters/export',
        name: 'PollstersExportToCSV',
        exact: true,
        element: PollstersExportToCSV,
        roles: ['Admin', 'User'],
        isAnonymous: false,
    },
];

const errorRoutes = [
    {
        path: '*',
        name: 'Error - 404',
        element: PageNotFound,
        roles: [],
        exact: true,
        isAnonymous: false,
    },
];

const allRoutes = [
  ...dashboardRoutes,
  ...test,
    ...errorRoutes,
    ...pollsters,
];

export default allRoutes;
