import PreLoadScreen from '@/pages/other/preLoadScreen';
import { fetcher } from '@/utils/fetcher';
import { useBreakpointValue } from '@chakra-ui/react';
import { createContext, useContext } from 'react'; //prettier-ignore
import useSWR, { KeyedMutator } from 'swr';

type CheckRole = (role: UserRole | UserRole[]) => boolean;
type ScreenType = 'mobile' | 'tablet' | 'desktop' 

type UserContext = {
	user: User;
	mutateUser: KeyedMutator<User>;
	roleIs: CheckRole;
	roleIsNot: CheckRole;
	screenType: ScreenType;
};

export type User = {
	userId: number;
	name: string;
	phone: string;
	role: UserRole;
	profilePicture: string | undefined;
	email: string;
	view?: {
		user?: {
			userId: number;
			name: string;
			role: UserRole;
		};
		company?: {
			companyId: number;
			coordinate: number[];
			name: string;
			type: string;
		};
	};
};

const UserContext = createContext<UserContext>({
	user: {
		userId: -1,
		name: '',
		phone: '',
		role: 'regular',
		profilePicture: '',
		email: '',
	},
	mutateUser: async () => undefined,
	roleIs: () => false,
	roleIsNot: () => false,
	screenType: 'desktop',
});

export default function useUser() {
	return useContext(UserContext);
}

export function UserContextProvider(props: any) {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const screenType = useBreakpointValue<ScreenType>({ base: 'mobile', md : 'tablet',  lg: 'desktop' })
	const { data: user, mutate } = useSWR<User>(
		`/app?timezone=${timezone}`,
		fetcher
	);

	if (!user || !screenType) return <PreLoadScreen />;

	return (
		<UserContext.Provider
			value={{
				user,
				mutateUser: mutate,
				roleIs: (role) => role.includes(user!.role),
				roleIsNot: (role) => !role.includes(user!.role),
				screenType, 
			}}
			children={props.children}
		/>
	);
}
