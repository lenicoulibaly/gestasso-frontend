import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { loader as productsLoader, productLoader } from 'api/products';

const MembreList = Loadable(lazy(() => import('views/production/membres')));
const CotisationList = Loadable(lazy(() => import('views/production/cotisations')));

// ==============================|| MAIN ROUTING ||============================== //

const ProductionRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [

        {
            path: '/production/membres',
            element: <MembreList />
        },
        {
            path: '/production/cotisations',
            element: <CotisationList/>
        }
    ]
};

export default ProductionRoutes;
