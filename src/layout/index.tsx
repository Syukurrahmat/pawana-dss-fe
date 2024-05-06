import MyAlert from '@/components/common/myAlert';
import { Box, Container } from '@chakra-ui/react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

type ContextType = React.Dispatch<React.SetStateAction<alertMessageType>>;

export default function App() {
	const [alertMessage, setAlertMessage] = useState<alertMessageType>(null);

 
	return (
		<Container maxW="container.full" id="container">
			<Sidebar id="sidebar" />
			<Header id="header" />
			<Box id="content" px="5" pt="3" pb="10">
				<Outlet context={setAlertMessage satisfies ContextType} />
			</Box>
			<ScrollToTop />
			<MyAlert messageContext={[alertMessage, setAlertMessage]} />
		</Container>
	);
}
export function useAlertDialog() {
	return useOutletContext<ContextType>();
}

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

