import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ToastProviderProps } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import appRouter from './routers/appRoutes.tsx';
import 'react-photo-view/dist/react-photo-view.css';
import 'leaflet/dist/leaflet.css';
import './app.css';

const toastOptions: ToastProviderProps = {
	defaultOptions: {
		isClosable: true,
		variant: 'left-accent',
		position: 'top-right',
		containerStyle: {
			margin: '30px 30px 0 0',
		},
	},
};


ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider cssVarsRoot={undefined} toastOptions={toastOptions}>
			<RouterProvider router={appRouter} />
		</ChakraProvider>
	</React.StrictMode>
);
