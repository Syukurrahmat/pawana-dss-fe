import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import VerifyPage from './pages/other/verify.tsx';
import './font.css';
import { myTheme } from './utils/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider theme={myTheme}>
			<VerifyPage/>
		</ChakraProvider>
	</React.StrictMode>
);
 