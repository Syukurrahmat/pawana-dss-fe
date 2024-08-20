import { IconBuildingFactory2, IconCircleDot, IconDashboard, IconDatabase, IconFileReport, IconInfoSquareRounded, IconNotebook, IconSpeakerphone, IconUser } from '@tabler/icons-react'; // prettier-ignore
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../layout';
import ErrorPage from '@/pages/other/page404';

const ReportsPage = lazy(() => import('@/pages/app/Reports'));
const DetailUser = lazy(() => import('@/pages/admin/Users/DetailUser'));
const Dashboard = lazy(() => import('@/pages/app/Dashboards/index'));
const DetailNode = lazy(() => import('@/pages/admin/Nodes/DetailNode'));
const CompaniesManagement = lazy(()=> import ('@/pages/admin/Companies/Companies')) // prettier-ignore
const CreateCompany = lazy(()=> import ('@/pages/admin/Companies/CreateCompany')) // prettier-ignore
const DetailCompany = lazy(()=> import ('@/pages/admin/Companies/DetailCompany')) // prettier-ignore
const CreateNode = lazy(() => import('@/pages/admin/Nodes/CreateNode'));
const NodeManagement = lazy(() => import('@/pages/admin/Nodes/Nodes'));
const CreateUser = lazy(() => import('@/pages/admin/Users/CreateUser'));
const UserManagement = lazy(() => import('@/pages/admin/Users/Users'));
const Notes = lazy(() => import('@/pages/app/EventLogs'));
const MyCompanies = lazy(() => import('@/pages/app/Resources/MyCompanies'));
const MySubscribedNodes = lazy(() => import('@/pages/app/Resources/MySubscribedNodes')); // prettier-ignore
const MyPrivateNode = lazy(() => import('@/pages/app/Resources/MyPrivateNode'));
const Summary = lazy(() => import('@/pages/app/Summary'));
const Data = lazy(() => import('@/pages/app/DownloadData'));
const Info = lazy(() => import('@/pages/app/Info'));

const routers = [
	{
		path: '/account',
		label: 'Akun',
		element: <DetailUser />,
		role: ['all'],
	},

	// REGULAR

	{
		path: '/',
		label: 'Dasbor',
		Icon: IconDashboard,
		element: <Dashboard />,
		role: ['all'],
	},
	{
		path: '/complaint',
		label: 'Aduan',
		Icon: IconSpeakerphone,
		element: <ReportsPage />,
		role: ['all'],
	},
	{
		path: '/nodes',
		label: 'Node',
		Icon: IconCircleDot,
		element: <MySubscribedNodes />,
		role: ['regular'],
	},

	// MANAGER

	{
		path: '/notes',
		label: 'Pencatatan',
		Icon: IconNotebook,
		element: <Notes />,
		role: ['manager', 'admin', 'gov'],
		showChangeDahshButton: true,
	},
	{
		path: '/summary',
		label: 'Laporan',
		Icon: IconFileReport,
		element: <Summary />,
		role: ['manager', 'admin', 'gov'],
		showChangeDahshButton: true,
	},
	{
		path: '/companies',
		label: 'Perusahaan Saya',
		Icon: IconBuildingFactory2,
		element: <MyCompanies />,
		role: ['manager'],
	},
	{
		path: '/nodes',
		label: 'Node Saya',
		Icon: IconCircleDot,
		element: <MyPrivateNode />,
		role: ['manager'],
	},

	// ADMIN
	{
		path: '/users',
		label: 'Kelola Pengguna',
		Icon: IconUser,
		element: <UserManagement />,
		role: ['admin', 'gov'],
	},
	{
		path: '/users/create',
		element: <CreateUser />,
		role: ['admin'],
	},
	{
		path: '/users/:id',
		element: <DetailUser />,
		role: ['admin', 'gov'],
	},

	{
		path: '/companies',
		label: 'Kelola Perusahaan',
		Icon: IconBuildingFactory2,
		element: <CompaniesManagement />,
		role: ['admin', 'gov'],
	},
	{
		path: '/companies/create',
		element: <CreateCompany />,
		role: ['admin', 'manager'],
	},
	{
		path: '/companies/:id',
		element: <DetailCompany />,
		role: ['admin', 'gov', 'manager'],
	},
	{
		path: '/companies/:id/create-node',
		element: <CreateNode />,
		role: ['manager', 'admin'],
	},
	{
		path: '/nodes',
		label: 'Kelola Node',
		Icon: IconCircleDot,
		element: <NodeManagement />,
		role: ['admin', 'gov'],
	},
	{
		path: '/nodes/create',
		element: <CreateNode />,
		role: ['admin', 'manager'],
	},
	{
		path: '/nodes/:id',
		element: <DetailNode />,
		role: ['all'],
	},

	{
		path: '/data',
		label: 'Data',
		Icon: IconDatabase,
		element: <Data />,
		role: ['manager', 'admin', 'gov'],
	},

	{
		path: '/info',
		label: 'Info',
		Icon: IconInfoSquareRounded,
		element: <Info />,
		role: ['all'],
	},
];

const generateAppRouter = (role: string) => {
	const routerList = routers.filter(
		(e) => e.role.includes(role) || e.role.includes('all')
	);

	const navlist = routerList.filter(
		(e) => (e.label && e.Icon) || e.path == '/account'
	);

	return createBrowserRouter([
		{
			path: '/',
			element: <App navbarList={navlist} />,
			children: routerList,
			errorElement: <ErrorPage />,
		},
	]);
};

export default generateAppRouter;
