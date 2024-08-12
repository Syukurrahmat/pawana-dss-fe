import logo from '@/assets/icon.svg';
import Logo from '@/components/common/Logo';
import {
	Center,
	Container,
	Divider,
	HStack,
	Heading,
	Icon,
	Image,
	VStack,
} from '@chakra-ui/react';
import { IconError404 } from '@tabler/icons-react';

export default function Page404() {
	return (
		<Container
			maxW="full"
			bg="#378CE7"
			p='6'
			flexDir="column"
			minH="100vh"
		>
			<Logo mb='4'/>
			{/* <Container as={VStack} spacing="0">
				<HStack>
					<HStack mb="4" px="2" color="gray.100">
						<Center p="1.5" bg="gray.100" rounded="md">
							<Image src={logo} h="30px" />
						</Center>
						<Heading fontSize="3xl">AtmosEye</Heading>
					</HStack>
				</HStack>
				<Divider />
				<VStack spacing="0">
					<Icon as={IconError404} boxSize="200px" color="gray.100" />
					<Heading size="xl" color="gray.100">
						Halaman tidak ditemukan
					</Heading>
				</VStack>
			</Container> */}
		</Container>
	);
}
