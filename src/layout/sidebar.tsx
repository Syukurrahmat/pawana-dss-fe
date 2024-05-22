import { BoxProps, Button, Divider, HStack, Heading, Image, Spacer, StackDivider, VStack} from '@chakra-ui/react'; // prettier-ignore
import { IconAnalyze, IconBuildingFactory2, IconCircleDot, IconDashboard, IconDatabase, IconLogout, IconSpeakerphone, IconStatusChange, IconUser} from '@tabler/icons-react'; // prettier-ignore
import { NavLink } from 'react-router-dom';
import logo from '../assets/icon.svg';

interface SidebarProps extends BoxProps {}

export const navbarlList = [
	[
		{ Icon: IconDashboard, label: 'Dashboard', path: '/' },
		{ Icon: IconAnalyze, label: 'Analitik', path: '/analytic' },
		{ Icon: IconSpeakerphone, label: 'Laporan', path: '/reports' },
		{ Icon: IconDatabase, label: 'Data', path: '/data' },
	],
	[
		{ Icon: IconBuildingFactory2, label: 'Aktivitas Saya', path: '/' },
		{ Icon: IconCircleDot, label: 'Node Saya', path: '/' },
	],
	[
		{ Icon: IconBuildingFactory2,label: 'Kelola Aktivitas',path: '/companies' },
		{ Icon: IconCircleDot, label: 'Kelola Node', path: '/nodes' },
		{ Icon: IconUser, label: 'Kelola Pengguna', path: '/users' },
	],
];

export default function Sidebar({ ...props }: SidebarProps) {
	return (
		<VStack p="5" align="stretch" minH="100vh" bg="gray.100" {...props}>
			<HStack mb="4" px="2">
				<Image src={logo} h="30px" />
				<Heading fontSize="2xl">DSS ixi</Heading>
			</HStack>

			<VStack
				align="stretch"
				divider={<StackDivider borderColor="gray.300" />}
				spacing="4"
			>
				{navbarlList.map((group,i) => (
					<VStack key={i} align="stretch">
						{group.map(({ Icon, label, path }, i) => (
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
				))}

				{/* {navbarlList.map(navbarGroup=>)(({ Icon, label, path }, i) => (
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
				))} */}
			</VStack>
			<Spacer />
			<Divider />
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
					leftIcon={<IconLogout />}
					children={'Logout'}
				/>
			</VStack>
		</VStack>
	);
}
