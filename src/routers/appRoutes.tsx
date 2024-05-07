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
import GroupManagement from '@/pages/admin/group/Groups';
import UserManagement from '@/pages/admin/user/Users';
import CreateUser from '@/pages/admin/user/CreateUser';
import DetailGroup from '@/pages/admin/group/DetailGroup';
import CreateGroup from '@/pages/admin/group/CreateGroup';
import NodeManagement from '@/pages/admin/node/Nodes';
import CreateNode from '@/pages/admin/node/CreateNode';
import DetailNode from '@/pages/admin/node/DetailNode';
import DetailUser from '@/pages/admin/user/DetailUser';

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
			
			{ path: '/users', element: <UserManagement /> },
			{ path: '/users/create', element: <CreateUser /> },
			{ path: '/users/:id', element: <DetailUser /> },

			{ path: '/groups', element: <GroupManagement /> },
			{ path: '/groups/create', element: <CreateGroup /> },
			{ path: '/groups/:id', element: <DetailGroup /> },
			
			{ path: '/nodes', element: <NodeManagement /> },
			{ path: '/nodes/create', element: <CreateNode /> },
			{ path: '/nodes/:id', element: <DetailNode /> },
		],
	},
]);




export default appRouter;
