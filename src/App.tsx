import { ChakraProvider } from '@chakra-ui/react';
import moment from 'moment';
import 'moment/locale/id';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfirmDialogProvider } from './hooks/useConfirmDialog.tsx';
import { UserContextProvider } from './hooks/useUser.tsx';
import { RouterProviderRoleBase } from './routers/appRoutes.tsx';
import { myTheme, toastOptions } from './utils/theme.ts';

import 'leaflet/dist/leaflet.css';
import 'react-photo-view/dist/react-photo-view.css';
import './app.css';
import './font.css';

moment.locale('id');

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider toastOptions={toastOptions} theme={myTheme}>
			<ConfirmDialogProvider>
				<UserContextProvider>
					<RouterProviderRoleBase />
				</UserContextProvider>
			</ConfirmDialogProvider>
		</ChakraProvider>
	</React.StrictMode>
);
