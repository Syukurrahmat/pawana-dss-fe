import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import appRouter from './routers/appRoutes.tsx';
import './indes.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider cssVarsRoot={undefined}>
			<RouterProvider router={appRouter} />
		</ChakraProvider>
	</React.StrictMode>
);
