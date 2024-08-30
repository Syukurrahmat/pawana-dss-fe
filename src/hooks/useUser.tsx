import PreLoadScreen from '@/pages/other/preLoadScreen';
import { fetcher } from '@/utils/fetcher';
import { createContext, useContext, useEffect } from 'react'; //prettier-ignore
import useSWR, { KeyedMutator } from 'swr';
import useConfirmDialog from './useConfirmDialog';

type CheckRole = (role: UserRole | UserRole[]) => boolean;

type UserContext = {
	user: User;
	mutateUser: KeyedMutator<User>;
	roleIs: CheckRole;
	roleIsNot: CheckRole;
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
});

export default function useUser() {
	return useContext(UserContext);
}

export function UserContextProvider(props: any) {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const confirmDialog = useConfirmDialog();
	const { data: user, mutate: mutateUser } = useSWR<User>(
		`/app?timezone=${timezone}`,
		fetcher
	);

	useEffect(() => {
		const sudah = window.localStorage.getItem('mobile-compatible-warn');
		if (!sudah && window.screen.availWidth <= 768) {
			confirmDialog({
				title: 'Peringatan',
				message:
					'Sistem belum sepenuhnya kompatible dengan perangkat mobile,\n Gunakan komputer atau laptop untuk pengalaman yang lebih optimal',
				onConfirm() {
					window.localStorage.setItem('mobile-compatible-warn', '1');
				},
				withoutCancelButton: true,
			});
		}
	}, []);

	const roleIs: CheckRole = (role) => role.includes(user!.role);
	const roleIsNot: CheckRole = (role) => !roleIs(role);
	if (!user) return <PreLoadScreen />;

	return (
		<UserContext.Provider
			value={{ user, mutateUser, roleIs, roleIsNot }}
			children={props.children}
		/>
	);
}
