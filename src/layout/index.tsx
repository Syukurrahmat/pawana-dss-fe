import { Box, Container } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { ConfirmDialogProvider } from '../hooks/useConfirmDialog';
import { AuthContextProvider } from '@/hooks/useAuth';

export default function App() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	useEffect(() => {
		fetch('/api/users')
			.then((e) => e.json())
			.then((e) => console.log(e));
	}, []);

	return (
		<AuthContextProvider>
			<ConfirmDialogProvider>
				<Container maxW="container.full" id="container">
					<Sidebar id="sidebar" />
					<Header id="header" />
					<Box
						flexDir="row"
						id="content"
						px="5"
						py="3"
						
						display="flex"
					>
						<Outlet />
					</Box>
				</Container>
			</ConfirmDialogProvider>
		</AuthContextProvider>
	);
}
