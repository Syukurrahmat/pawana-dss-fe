import { Box, Container } from '@chakra-ui/react';
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import LoadingComponent from '@/components/Loading/LoadingComponent';

export default function App({ navbarList }: { navbarList: any[] }) {
	const { pathname } = useLocation();
	const [activeNav, setActiveNav] = useState<any>({});
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
		setActiveNav(
			navbarList.find((e) => e.path == '/' + location.pathname.split('/')[1]) || {} //prettier-ignore
		);
	}, [pathname]);

	return (
		<Container maxW="container.full" id="container">
			<Sidebar
				id="sidebar"
				setActiveNav={setActiveNav}
				navbarList={navbarList}
			/>
			<Header id="header" activeNav={activeNav} />
			<Box flexDir="row" id="content" px="5" py="3" pb="10" display="flex">
				<Suspense fallback={<LoadingComponent />}>
					<Outlet />
				</Suspense>
			</Box>
		</Container>
	);
}
