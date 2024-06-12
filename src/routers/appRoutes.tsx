import { createBrowserRouter } from 'react-router-dom';
import App from '../layout';
import Dashboard from '../pages/app/dashboards/index';
import Analysis from '@/pages/app/analitics';
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
import MyCompanies from '@/pages/app/myCompanies';
import MyNodes from '@/pages/app/myNodes/myNodes';
import Notes from '@/pages/app/eventLogs';
import Assesment from '@/pages/app/summary';

const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Dashboard /> },
			{ path: '/analytic', element: <Analysis /> },
			{ path: '/data', element: <Data /> },
			{ path: '/reports', element: <ReportsPage /> },
			{ path: '/account', element: <DetailUser /> },
			{ path: '/notes', element: <Notes /> },
			{ path: '/summary', element: <Assesment /> },

			{ path: '/my-nodes', element: <MyNodes /> },
			{ path: '/my-companies', element: <MyCompanies /> },

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
