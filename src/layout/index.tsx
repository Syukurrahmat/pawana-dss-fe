import MyAlert, { AlertDialogType } from '@/components/common/myAlert';
import { Box, Container } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

export default function App() {
	const [alertMessage, setAlertMessage] = useState<alertMessageType>(null);
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<Container maxW="container.full" id="container">
			<Sidebar id="sidebar" />
			<Header id="header" />
			<Box id="content" px="5" pt="3" pb="10">
				<Outlet context={setAlertMessage satisfies AlertDialogType} />
			</Box>
			<MyAlert messageContext={[alertMessage, setAlertMessage]} />
		</Container>
	);
}
