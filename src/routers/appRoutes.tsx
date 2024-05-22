import { createBrowserRouter } from 'react-router-dom';
import App from '../layout';
import Dashboard from '../pages/app/dashboards/index';
import Analysis from '@/pages/app/analysis';
import Data from '../pages/app/data';
import NodeManagement from '@/pages/admin/nodes/Nodes';
import CreateNode from '@/pages/admin/nodes/CreateNode';
import DetailNode from '@/pages/admin/nodes/DetailNode';
import UserManagement from '@/pages/admin/users/Users';
import CreateUser from '@/pages/admin/users/CreateUser';
import DetailUser from '@/pages/admin/users/DetailUser';
import CompaniesManagement from '@/pages/admin/companies/Companies';
import CreateCompany from '@/pages/admin/companies/CreateCompany';
import DetailCompany from '@/pages/admin/companies/DetailCompany';
import ReportsPage from '@/pages/app/reports';
import { AuthLoader } from '@/hooks/useAuth';

const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: AuthLoader,
		children: [
			{ path: '/', element: <Dashboard /> },
			{ path: '/analytic', element: <Analysis /> },
			{ path: '/data', element: <Data /> },
			{ path: '/group', element: <Data /> },
			{ path: '/account', element: <DetailUser /> },

			{ path: '/reports', element: <ReportsPage /> },

			// FOR ADMIN ONLY
			{ path: '/users', element: <UserManagement /> },
			{ path: '/users/create', element: <CreateUser /> },
			{ path: '/users/:id', element: <DetailUser /> },

			{ path: '/companies', element: <CompaniesManagement /> },
			{ path: '/companies/create', element: <CreateCompany /> },
			{ path: '/companies/:id', element: <DetailCompany /> },

			{ path: '/nodes', element: <NodeManagement /> },
			{ path: '/nodes/create', element: <CreateNode /> },
			{ path: '/nodes/:id', element: <DetailNode /> },
		],
	},
]);

export default appRouter;
