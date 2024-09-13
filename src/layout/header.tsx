import {
	Divider,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	VStack,
} from '@chakra-ui/react';

import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import { TagUserRole } from '@/components/Tags/index.tags';
import { SERVER_URL } from '@/constants/config';
import useUser from '@/hooks/useUser';
import { Avatar, BoxProps, HStack, Heading, Spacer } from '@chakra-ui/react';
import { IconAlignJustified, IconLogout, IconUser } from '@tabler/icons-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface HeaderProps extends BoxProps {
	activeNav: any;
	sidebarIsColapseState: StateOf<boolean>;
}

export default function Header({
	activeNav,
	sidebarIsColapseState,
	...props
}: HeaderProps) {
	const setSidebarIsColapse = sidebarIsColapseState[1];
	const { user } = useUser();
	const navigate = useNavigate();

	return (
		<HStack
			px="5"
			borderBottom="1px solid var(--chakra-colors-gray-200)"
			shadow="sm"
			justify="space-between"
			w="full"
			minH="55px"
			maxH="55px"
			pos="sticky"
			top="0"
			zIndex="1100"
			bg="#F9F9F9"
			{...props}
		>
			<HStack>
				<IconButton
					className="is-mobile"
					ml="-3.5"
					colorScheme="gray"
					icon={<IconAlignJustified />}
					variant="ghost"
					color="gray.600"
					aria-label="Menu"
					onClick={() => {
						setSidebarIsColapse((e) => !e);
					}}
				/>

				<Heading
					lineHeight="100%"
					color="gray.700"
					fontWeight="600"
					size="md"
					children={activeNav.label}
				/>
			</HStack>

			<Spacer />

			{activeNav.showChangeDahshButton && <ChangeActiveDashboard />}

			<Menu>
				<MenuButton>
					<Avatar
						boxSize="34px"
						ml="2"
						name={user.name}
						src={user.profilePicture}
					/>
				</MenuButton>
				<MenuList shadow="md" minW="250px" rounded="lg">
					<VStack py="4" spacing="0">
						<Avatar
							size="xl"
							mb="2"
							name={user.name}
							src={user.profilePicture}
						/>
						<Text fontWeight="600" fontSize="lg">
							{user.name}
						</Text>
						<Text>{user.email}</Text>
						<TagUserRole value={user.role} mt="2" />
					</VStack>
					<Divider />
					<MenuItem
						onClick={() => navigate('/account')}
						py="3"
						icon={<IconUser size="20px" />}
					>
						Detail Akun saya
					</MenuItem>
					<MenuItem
						py="3"
						onClick={() => {
							axios
								.delete(SERVER_URL + '/auth/logout', {
									withCredentials: true,
								})
								.then((res) => {
									if (res.statusText == 'OK') {
										setTimeout(() => {
											window.location.href = '/login';
										});
									}
								});
						}}
						icon={<IconLogout size="20px" />}
					>
						Keluar
					</MenuItem>
				</MenuList>
			</Menu>
		</HStack>
	);
}
