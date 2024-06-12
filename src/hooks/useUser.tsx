import logo from '@/assets/icon.svg';
import { apiFetcher } from '@/utils/fetcher';
import {
	Center,
	Container,
	HStack,
	Heading,
	Image,
	Progress
} from '@chakra-ui/react';
import { createContext, useContext } from 'react'; //prettier-ignore
import useSWR, { KeyedMutator } from 'swr';

type UserContext = {
	user: User;
	mutateUser: KeyedMutator<User>;
};

type User = {
	userId: number;
	name: string;
	phone: string;
	role: string;
	profilePicture: string | undefined;
	email: string;

	countSubscribedNodes: number;
	countManagedCompany: number;

	activeDashboard: 'companySub' | 'userSubs';
	activeCompany: {
		companyId: number;
		coordinate: number[];
		name: string;
		type: string;
	} | null;
};

const UserContext = createContext<UserContext>({
	user: {
		userId: -1,
		name: '',
		phone: '',
		role: '',
		profilePicture: '',
		email: '',

		countSubscribedNodes: 0,
		countManagedCompany: 0,
		activeDashboard: 'userSubs',
		activeCompany: {
			companyId: NaN,
			coordinate: [NaN, NaN],
			type: '',
			name: '',
		},
	},
	mutateUser: async () => undefined,
});

export default function useUser() {
	return useContext(UserContext);
}

export function UserContextProvider(props: any) {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const {
		data: user,
		mutate: mutateUser,
		isLoading,
	} = useSWR<User>(`/me?timezone=${timezone}`, apiFetcher);

	if (!user || isLoading)
		return (
			<Container
				maxW="full"
				as={Center}
				flexDir="column"
				pb="70px"
				bg="#378CE7"
				minH="100vh"
			>
				<HStack>
					<Center rounded="lg" boxSize="50px" bg="gray.50">
						<Image src={logo} />
					</Center>
					<Heading size="2xl" color="gray.50">
						Pawana
					</Heading>
				</HStack>

				<Progress
					mt="8"
					outline="3px solid"
					outlineColor="gray.100"
					w="300px"
					isIndeterminate
					rounded="md"
				/>
			</Container>
		);

	return (
		<UserContext.Provider
			value={{ user, mutateUser }}
			children={props.children}
		/>
	);
}
