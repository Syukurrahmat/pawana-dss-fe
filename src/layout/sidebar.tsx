import { BoxProps, Button, Divider, HStack, Heading, Image, Spacer, VStack} from '@chakra-ui/react'; // prettier-ignore
import { IconAnalyze, IconBuildingFactory, IconDashboard, IconDatabase, IconLogout, IconStatusChange, IconUser, IconUsersGroup} from '@tabler/icons-react'; // prettier-ignore
import { NavLink } from 'react-router-dom';
import logo from '../assets/icon.svg';

interface SidebarProps extends BoxProps {}

export default function Sidebar({ ...props }: SidebarProps) {
	const navDetailList = [
		{ Icon: IconDashboard, label: 'Dashboard', path: '/' },
		{ Icon: IconAnalyze, label: 'Analisis', path: '/analysis' },
		{ Icon: IconDatabase, label: 'Data', path: '/data' },
		{ Icon: IconUsersGroup, label: 'Grup', path: '/group' },
		{ Icon: IconBuildingFactory, label: 'Activitas', path: '/activity' },
		{ Icon: IconUsersGroup, label: 'Manajemen Grup', path: '/groups' },
		{ Icon: IconUser, label: 'Manajemen Pengguna', path: '/users' },
	];

	return (
		<VStack
			p="5"
			align="stretch"
			minH="100vh"
			bg="gray.100"
			{...props}
		>
			<HStack mb="4" px="2">
				<Image src={logo} h="30px" />
				<Heading fontSize="2xl">DSS ixi</Heading>
			</HStack>

			<VStack align="stretch">
				{navDetailList.map(({ Icon, label, path }, i) => (
					<NavLink to={path} key={i}>
						{({ isActive }) => (
							<Button
								w="full"
								p="3"
								isActive={isActive}
								leftIcon={<Icon />}
								justifyContent="left"
								children={label}
							/>
						)}
					</NavLink>
				))}
			</VStack>
			<Spacer />
			<Divider/>
			<VStack align="stretch">
				<Button
					p="3"
					justifyContent="left"
					leftIcon={<IconUser />}
					children={'Akun'}
				/>
					<Button
						p="3"
						justifyContent="left"
						leftIcon={<IconStatusChange />}
						children={'Ganti Role'}
					/>
				<Button
					p="3"
					justifyContent="left"
					leftIcon={<IconLogout />}
					children={'Logout'}
				/>
			</VStack>
		</VStack>
	);
}
