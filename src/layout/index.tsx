import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
 
export default function App() {
	return (
		<Container
			as={Grid}
			maxW="container.full"
			p="0"
			minH="100vh"
			templateColumns="240px auto"
			templateRows="60px auto"
			bg="#F4F5F9"
		>
			<Sidebar as={GridItem} gridArea="1 / 1 / 3 / 2" />
			<Header
				as={GridItem}
				gridArea="1 / 2 / 2 / 3"
				
			/>
			<Box mt='4' p="5" as={GridItem} gridArea="2 / 2 / 3 / 3">
				<Outlet  />
			</Box>
		</Container>
	);
}
