import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import appRouter from './routers/appRoutes.tsx';
import 'leaflet/dist/leaflet.css';
import './app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider
			cssVarsRoot={undefined}
			toastOptions={{
				defaultOptions: {
					isClosable: true,
					variant:'left-accent',
					position: 'top-right',
					containerStyle:{
						margin: '30px 30px 0 0'
					}
				},
			}}
		>
			<RouterProvider router={appRouter} />
			
		</ChakraProvider>
	</React.StrictMode>
);
