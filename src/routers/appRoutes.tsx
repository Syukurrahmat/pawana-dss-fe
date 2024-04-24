import { createBrowserRouter } from 'react-router-dom';
import App from '../layout';
import Dashboard from '../pages/dashboard/index';
import Analysis from '../pages/analysis';
import Group from '../pages/group';
import GroupDetail from '../pages/groupDetail';
import UserSetting from '../pages/userSetting';
import Data from '../pages/data';
import Activity from '../pages/analysis';
import ISPUTap from '../pages/analysis/ispu';
import EmisiGRKTab from '../pages/analysis/emisiGRKTab';
import IklimMikroTab from '../pages/analysis/iklimMikro';

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
		],
	},
]);

export default appRouter;
