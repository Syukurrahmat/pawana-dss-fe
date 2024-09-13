import logo from '@/assets/logo/logo.svg';
import { SERVER_URL } from '@/constants/config';
import { responsiveCardSize } from '@/utils/common.utils';
import { Box, Card, CardBody, CardHeader, Center, Container, Divider, Heading, HStack, Image, Spinner, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import {
	IconAlertTriangle,
	IconChecks,
	IconCircleCheck,
} from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
export default function VerifyPage() {
	const data = {
		loading: {
			color: 'blue',
			icon: <Spinner thickness="2px" />,
			title: 'Memverifikasi ...',
			subtitle: 'Harap Tunggu sebentar',
			note: 'Kami sedang memproses data Anda. Pastikan koneksi internet Anda stabil.',
		},
		success: {
			color: 'green',
			icon: <IconChecks size="100%" />,
			title: 'Verifikasi Berhasil',
			subtitle: 'Kata sandi akun akan segera dikirim ke email terdaftar',
			note: 'Jika Anda tidak menerima email dalam beberapa menit, harap cek folder spam, atau hubungi admin untuk bantuan lebih lanjut',
		},

		verified: {
			color: 'green',
			icon: <IconCircleCheck size="100%" />,
			title: 'Akun sudah terverifikasi',
			subtitle: 'Akun Anda sudah terverifikasi sebelumnya',
			note: 'Jika Anda yakin ini adalah kesalahan, hubungi admin untuk bantuan lebih lanjut.',
		},

		expired: {
			color: 'orange',
			icon: <IconAlertTriangle size="100%" />,
			title: 'Verifikasi Kedaluarsa',
			subtitle: 'Verifikasi telah melewati batas waktu',
			note: 'Verifikasi akun Anda tidak dapat diselesaikan karena sudah melewati batas waktu 7 hari setelah Email didaftarkan. Harap hubungi admin agar akun Anda dapat didaftarkan ulang',
		},

		inValid: {
			color: 'red',
			icon: <IconAlertTriangle size="100%" />,
			title: 'Verifikasi tidak valid',
			subtitle: 'Kami tidak dapat memproses verifikasi',
			note: 'Pastikan Anda mengakses halaman ini melalui email yang telah kami kirimkan. Harap hubungi admin untuk mendapatkan bantuan lebih lanjut',
		},
	};

	const [state, setState] = useState<keyof typeof data>('loading');
	const { color, icon, title, subtitle, note } = data[state];

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get('token');

		if (!token) {
			setState('inValid');
			return;
		}

		axios
			.post(SERVER_URL + '/auth/verify', { token }, {withCredentials : true})
			.then(() => setState('success'))
			.catch(({ response }) => {
				response.status === 409
					? setState('verified')
					: response.status === 401
					? setState('expired')
					: setState('inValid');
			});
	}, []);

	return (
		<Container
			maxW="full"
			bg="#378CE7"
			minH="100vh"
			pb="5%"
			as={VStack}
			justify="center"
		>
			<Container maxW="container.sm" pb="15">
				<Card shadow="xl" size={responsiveCardSize}>
					<CardHeader py="2" textAlign="center">
						<Image src={logo} h="40px" />
					</CardHeader>
					<Divider borderColor="gray.400" />
					<CardBody as={VStack}>
						<HStack spacing="4">
							<Center
								p="2"
								color={color + '.800'}
								bg={color + '.300'}
								boxSize="45px"
								rounded="md"
							>
								{icon}
							</Center>
							<Heading size="lg" fontWeight="600">
								{title}
							</Heading>
						</HStack>

						<Box mt="4">
							<Text
								maxW="md"
								color="gray.600"
								fontWeight="600"
								fontSize="lg"
							>
								{subtitle}
							</Text>
							<Text maxW="md" mt="1" fontSize="sm" color="gray.600">
								{note}
							</Text>
						</Box>
					</CardBody>
				</Card>
			</Container>
		</Container>
	);
}
