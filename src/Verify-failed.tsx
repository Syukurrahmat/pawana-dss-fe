import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import VerifyPage from './pages/other/verify.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider cssVarsRoot={undefined}>
			<VerifyPage failed/>
		</ChakraProvider>
	</React.StrictMode>
);
 