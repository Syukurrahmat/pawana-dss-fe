import { UserContextProvider } from '@/hooks/useUser';
import { Box, Container } from '@chakra-ui/react';
import { IconReport, IconBuildingFactory2, IconCircleDot, IconDashboard, IconDatabase, IconNotebook, IconSpeakerphone, IconUser } from '@tabler/icons-react'; // prettier-ignore
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ConfirmDialogProvider } from '../hooks/useConfirmDialog';
import Header from './header';
import Sidebar from './sidebar';

export default function App() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<UserContextProvider>
			<ConfirmDialogProvider>
				<Layout />
			</ConfirmDialogProvider>
		</UserContextProvider>
	);
}

function Layout() {
	// const { user } = useUser();

	// const regularMenu = [
	// 	{ Icon: IconDashboard, label: 'Dashboard', path: '/' },
	// 	{ Icon: IconSpeakerphone, label: 'Aduan', path: '/reports' },
	// 	{ Icon: IconCircleDot, label: 'Sensor Saya', path: '/my-nodes' },
	// 	{ Icon: IconDatabase, label: 'Data', path: '/data' },
	// ];

	// const managerMenu = [
	// 	{ Icon: IconDashboard, label: 'Dashboard', path: '/' },
	// 	{ Icon: IconSpeakerphone, label: 'Aduan', path: '/reports' },
	// 	{ Icon: IconNotebook, label: 'Pencatatan', path: '/notes' },
	// 	{ Icon: IconBuildingFactory2, label: 'Usaha Saya', path: '/my-companies' }, //prettier-ignore
	// 	{ Icon: IconCircleDot, label: 'Sensor Saya', path: '/my-nodes' },
	// 	{ Icon: IconDatabase, label: 'Data', path: '/data' },
	// ];

	// const adminMenu = [
	// 	{ Icon: IconDashboard, label: 'Dashboard', path: '/' },
	// 	{ Icon: IconSpeakerphone, label: 'Aduan', path: '/reports' },
	// 	{ Icon: IconDatabase, label: 'Data', path: '/data' },
	// 	{ Icon: IconBuildingFactory2, label: 'Kelola Usaha', path: '/companies' }, //prettier-ignore
	// 	{ Icon: IconCircleDot, label: 'Kelola Node', path: '/nodes' },
	// 	{ Icon: IconUser, label: 'Kelola Pengguna', path: '/users' },
	// ];

	const devMenu = [
		{ Icon: IconDashboard, label: 'Dashboard', path: '/' },
		{ Icon: IconSpeakerphone, label: 'Aduan', path: '/reports' },
		{ Icon: IconNotebook, label: 'Pencatatan', path: '/notes' },
		{ Icon: IconReport, label: 'Ringkasan', path: '/summary' },
		{ Icon: IconCircleDot, label: 'Sensor Saya', path: '/my-nodes' },
		{ Icon: IconBuildingFactory2, label: 'Usaha Saya', path: '/my-companies' }, //prettier-ignore
		{ Icon: IconDatabase, label: 'Data', path: '/data' },

		{ Icon: IconBuildingFactory2, label: 'Kelola Usaha', path: '/companies' }, //prettier-ignore
		{ Icon: IconCircleDot, label: 'Kelola Node', path: '/nodes' },
		{ Icon: IconUser, label: 'Kelola Pengguna', path: '/users' },
	];

	const navbarList = devMenu;

	return (
		<Container maxW="container.full" id="container">
			<Sidebar id="sidebar" navbarList={navbarList} />
			<Header id="header" navbarList={navbarList} />
			<Box flexDir="row" id="content" px="5" py="3" pb="10" display="flex">
				<Outlet />
			</Box>
		</Container>
	);
}
