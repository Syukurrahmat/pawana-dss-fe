import { ChakraProvider } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import moment from 'moment';
import 'moment/locale/id';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-photo-view/dist/react-photo-view.css';
import './app.css';
import { ConfirmDialogProvider } from './hooks/useConfirmDialog.tsx';
import { UserContextProvider } from './hooks/useUser.tsx';
import { RouterProviderRoleBase } from './routers/appRoutes.tsx';

moment.locale('id');

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider
			cssVarsRoot={undefined}
			toastOptions={{
				defaultOptions: {
					isClosable: true,
					variant: 'left-accent',
					position: 'top-right',
					containerStyle: {
						margin: '30px 30px 0 0',
					},
				},
			}}
		>
			<ConfirmDialogProvider>
				<UserContextProvider>
					<RouterProviderRoleBase />
				</UserContextProvider>
			</ConfirmDialogProvider>
		</ChakraProvider>
	</React.StrictMode>
);
