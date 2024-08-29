import LoadingComponent from '@/components/Loading/LoadingComponent';
import { Box, Container } from '@chakra-ui/react';
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';

export default function App({ navbarList }: { navbarList: any[] }) {
	const { pathname } = useLocation();
	const [activeNav, setActiveNav] = useState<any>({});
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
		const activeNav = navbarList.find(
			(e) => e.path == '/' + location.pathname.split('/')[1]
		);
		setActiveNav(activeNav || {});
		if (activeNav?.label) {
			document.title =
				activeNav.label == 'Dasbor'
					? 'Pawana'
					: activeNav?.label + ' - Pawana';
		}
	}, [pathname]);

	return (
		<Container maxW="container.full" id="container">
			<Sidebar
				id="sidebar"
				setActiveNav={setActiveNav}
				navbarList={navbarList}
			/>
			<Header id="header" activeNav={activeNav} />
			<Container maxW="1280px" p="0">
				<Box
					w="full"
					flexDir="row"
					id="content"
					px="5"
					py="3"
					pb="10"
					display="flex"
				>
					<Suspense fallback={<LoadingComponent />}>
						<Outlet />
					</Suspense>
				</Box>
			</Container>
		</Container>
	);
}
