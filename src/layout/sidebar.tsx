import { HOST_URL } from '@/constants/config';
import { Box, BoxProps, Button, Divider, Image, Spacer, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconLogout, IconUser } from '@tabler/icons-react'; // prettier-ignore
import axios from 'axios';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '@/assets/icon.svg';

const LogoutButton = () => {
	const [isLoading, setIsLoading] = useState(false);

	const onClickHandle = async () => {
		setIsLoading(true);
		const res = await axios.delete(HOST_URL + '/auth/logout');
		setIsLoading(false);
		if (res.statusText == 'OK') {
			window.location.href = '/login';
		}
	};

	return (
		<Button
			isLoading={isLoading}
			p="3"
			loadingText="Logout"
			color={'gray.600'}
			justifyContent="left"
			leftIcon={<IconLogout />}
			children={'Logout'}
			onClick={onClickHandle}
		/>
	);
};

interface SidebarProps extends BoxProps {
	navbarList: {
		Icon: React.ForwardRefExoticComponent<any>;
		label: string;
		path: string;
	}[];

	setActiveNav: (v: any) => any;
}

export default function Sidebar({
	navbarList,
	setActiveNav,
	...props
}: SidebarProps) {
	return (
		<VStack p="5" align="stretch" minH="100vh" bg="gray.100" {...props}>
			<Box as={Link} to="/" mb="4" ml="2">
				<Image src={logo} h="40px" />
			</Box>

			<VStack as="nav" align="stretch">
				{navbarList
					.filter((e) => e.Icon)
					.map((e, i) => (
						<NavLink to={e.path} key={i}>
							{({ isActive }) => (
								<Button
									w="full"
									p="3"
									color={isActive ? 'gray.900' : 'gray.600'}
									isActive={isActive}
									leftIcon={<e.Icon />}
									justifyContent="left"
									children={e.label}
									onClick={() => setActiveNav(e)}
								/>
							)}
						</NavLink>
					))}
			</VStack>
			<Spacer />
			<Divider />
			<VStack align="stretch">
				<NavLink to="/account">
					{({ isActive }) => (
						<Button
							w="full"
							p="3"
							color={isActive ? 'gray.900' : 'gray.600'}
							isActive={isActive}
							justifyContent="left"
							leftIcon={<IconUser />}
							children={'Akun'}
						/>
					)}
				</NavLink>
				<LogoutButton />
			</VStack>
		</VStack>
	);
}
