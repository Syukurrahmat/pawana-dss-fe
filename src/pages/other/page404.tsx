import logo from '@/assets/icon-white.svg';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Divider,
	Heading,
	HStack,
	Icon,
	Image,
	Spacer,
	Text,
	VStack,
} from '@chakra-ui/react';
import { IconError404 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
	let navigate = useNavigate();

	return (
		<Container maxW="full" bg="#378CE7" flexDir="column" minH="100vh">
			<Container as={VStack} maxW="container.sm" h="100vh" p="4">
				<Image src={logo} h="40px" />
				<Spacer />
				<Card rounded="md">
					<CardHeader
						as={HStack}
						spacing="4"
						align="center"
						justify="center"
						pb='0'
					>
						<Icon as={IconError404} boxSize="125px" />
						<Heading size="lg">
							Opss.... <br /> Halaman tidak ditemukan.
						</Heading>
					</CardHeader>
					<Divider borderColor='gray.400'/>
					<CardBody as={VStack} align="start" w="full">
						<Text fontSize="lg">
							Kami tidak dapat menemukan halaman yang Anda cari. Coba
							periksa URL atau kembali ke beranda
						</Text>
						<Button mt='2' colorScheme='blue' onClick={() => navigate('/')}>
							Kembali ke Dasbor
						</Button>
					</CardBody>
				</Card>
				<Spacer />
				<Spacer />
			</Container>
		</Container>
	);
}
