import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

export default function App() {
	return (
		<Container
			maxW="container.full"
			id='container'
		>
			<Sidebar id='sidebar' />
			<Header id='header' />
			<Box id='content' px='5' pt='3' pb='10'>
				<Outlet />
			</Box>
		</Container>
	);
}
