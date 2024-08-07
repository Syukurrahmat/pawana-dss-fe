import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/other/login.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider cssVarsRoot={undefined}>
			<LoginPage/>
		</ChakraProvider>
	</React.StrictMode>
);
 