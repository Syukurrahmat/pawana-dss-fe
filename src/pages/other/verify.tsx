import logo from '@/assets/icon.svg';
import { Card, CardBody, CardHeader, Center, Container, Divider, Heading, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconAlertTriangle, IconChecks } from '@tabler/icons-react';

export default function VerifyPage({ failed }: { failed?: boolean }) {
	const data = {
		success: {
			color: 'green',
			icon: IconChecks,
			title: 'Verifikasi Berhasil',
			subtitle: 'Kata sandi akun akan segera dikirim ke email terdaftar',
			note: 'Jika Anda tidak menerima email dalam beberapa menit, harap cek folder spam, atau hubungi admin untuk bantuan lebih lanjut',
		},
		error: {
			color: 'red',
			icon: IconAlertTriangle,
			title: 'Verifikasi Gagal',
			subtitle: 'Kami tidak dapat memverifikasi akun Anda saat ini.',
			note: 'Untuk menyelesaikan masalah ini, harap hubungi admin agar akun Anda dapat didaftarkan ulang',
		},
	};

	const { color, icon, title, subtitle, note } =
		data[failed ? 'error' : 'success'];

	return (
		<Container
			maxW="full"
			bg="#378CE7"
			minH="100vh"
			as={VStack}
			justify="center"
		>
			<Container maxW="container.sm" pb="15">
				<Card shadow="xl">
					<CardHeader py="2" textAlign="center">
						<Image src={logo} h="40px" />
					</CardHeader>
					<Divider borderColor="gray.400" />
					<CardBody as={VStack}>
						<HStack>
							<Center
								p="2"
								color={color + '.800'}
								bg={color + '.300'}
								boxSize="45px"
								rounded="md"
							>
								<Icon as={icon} boxSize="100%" />
							</Center>
							<Heading size="lg" fontWeight="600">
								{title}
							</Heading>
						</HStack>
						<Text maxW="md" fontWeight="600" fontSize="lg">
							{subtitle}
						</Text>
						<Text maxW="md" mt="4" fontSize="sm" color="gray.600">
							{note}
						</Text>
					</CardBody>
				</Card>
			</Container>
		</Container>
	);
}
