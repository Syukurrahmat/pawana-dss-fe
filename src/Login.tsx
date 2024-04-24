import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/app/login/index.tsx';
import './indes.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider cssVarsRoot={undefined}>
			<LoginPage/>
		</ChakraProvider>
	</React.StrictMode>
);
