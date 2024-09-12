import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import LoginPage from './pages/other/login.tsx';
import './font.css';
import { myTheme } from './utils/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider  theme={myTheme}>
			<LoginPage/>
		</ChakraProvider>
	</React.StrictMode>
);
 