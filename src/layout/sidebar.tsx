import { BoxProps, Button, Divider, HStack, Heading, Image, Spacer, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconLogout, IconUser } from '@tabler/icons-react'; // prettier-ignore
import { NavLink } from 'react-router-dom';
import logo from '../assets/icon.svg';

interface SidebarProps extends BoxProps {
	navbarList: {
		Icon: React.ForwardRefExoticComponent<any>;
		label: string;
		path: string;
	}[];
}

export default function Sidebar({ navbarList, ...props }: SidebarProps) {
	return (
		<VStack p="5" align="stretch" minH="100vh" bg="gray.100" {...props}>
			<HStack mb="4" px="2">
				<Image src={logo} h="30px" />
				<Heading fontSize="2xl">DSS</Heading>
			</HStack>

			<VStack align="stretch">
				{navbarList.map(({ Icon, label, path }, i) => (
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
			<Divider />
			<VStack align="stretch">
				<NavLink to='/account'>
					<Button
						p="3"
						justifyContent="left"
						leftIcon={<IconUser />}
						children={'Akun'}
						w='full'
					/>
				</NavLink>
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
