import { createBrowserRouter } from 'react-router-dom';
import App from '../layout';
import Dashboard from '../pages/app/dashboards/index';
import Analysis from '@/pages/app/analysis';
import Group from '../pages/app/group';
import GroupDetail from '../pages/app/groupDetail';
import UserSetting from '../pages/app/userSetting';
import Data from '../pages/app/data';
import Activity from '@/pages/app/activity';
import ISPUTap from '@/pages/app/analysis/ispu';
import EmisiGRKTab from '@/pages/app/analysis/emisiGRKTab';
import IklimMikroTab from '@/pages/app/analysis/iklimMikro';
import GroupManagement from '@/pages/admin/groupManagement';
import UserManagement from '@/pages/admin/user/allUsers';
import CreateUser from '@/pages/admin/user/createUser';
import DetailUser from '@/pages/admin/user/detailUser';

const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <Dashboard /> },
			{
				path: '/analysis',
				element: <Analysis />,
				children: [
					{ path: 'ispu', index: true, element: <ISPUTap /> },
					{ path: 'grk', element: <EmisiGRKTab /> },
					{ path: 'iklimmikro', element: <IklimMikroTab /> },
				],
			},
			{ path: '/group', element: <Group /> },
			{ path: '/data', element: <Data /> },
			{ path: '/activity', element: <Activity /> },
			{ path: '/group/:groupId', element: <GroupDetail /> },
			{ path: '/user-setting', element: <UserSetting /> },
			{ path: '/groups', element: <GroupManagement /> },
			{ path: '/users', element: <UserManagement /> },
			{ path: '/users/create', element: <CreateUser /> },
			{ path: '/users/:id', element: <DetailUser /> },
		],
	},
]);

export default appRouter;
