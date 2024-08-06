import { ChakraProvider, ToastProviderProps } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import moment from 'moment';
import 'moment/locale/id';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-photo-view/dist/react-photo-view.css';
import { RouterProvider } from 'react-router-dom';
import './app.css';
import { ConfirmDialogProvider } from './hooks/useConfirmDialog.tsx';
import useUser, { UserContextProvider } from './hooks/useUser.tsx';
import appRouter from './routers/appRoutes.tsx';

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

moment.locale('id');

const RouterProviderRoleBase = () => {
	const { user } = useUser();
	return <RouterProvider router={appRouter(user.role)} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ChakraProvider cssVarsRoot={undefined} toastOptions={toastOptions}>
			<UserContextProvider>
				<ConfirmDialogProvider>
					<RouterProviderRoleBase />
				</ConfirmDialogProvider>
			</UserContextProvider>
		</ChakraProvider>
	</React.StrictMode>
);


