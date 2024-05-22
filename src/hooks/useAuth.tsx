import { HOST_URL } from '@/constants/config';
import axios from 'axios';
import { createContext, useContext, useState } from 'react'; //prettier-ignore
import { useLoaderData } from 'react-router-dom';

type AuthContext = {
	userId: number;
	name: string;
	phone: string;
	email: string;
	role: string;
	profilePicture: string;
	isVerified: boolean;
};

const AuthContext = createContext<AuthContext>({
	userId: -1,
	name: '',
	phone: '',
	role: '',
	profilePicture: '',
	email: '',
	isVerified: false,
});

export default function useAuthContext() {
	return useContext(AuthContext);
}

export async function AuthLoader() {
	return await axios(HOST_URL + '/auth/me').then((e) => {
		return e.data
	});
}

export function AuthContextProvider(props: any) {
	const userData = useLoaderData() as AuthContext

	return (
		<AuthContext.Provider value={userData}>
			{props.children}
		</AuthContext.Provider>
	);
}
