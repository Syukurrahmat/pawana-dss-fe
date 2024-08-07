import logo from '@/assets/icon.svg';
import InputPassword from '@/components/Form/inputPassword';
import { HOST_URL } from '@/constants/config';
import { Box, Button, Card, CardBody, CardHeader, Center, Container, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Image, Input, Text, VStack, useToast } from '@chakra-ui/react'; // prettier-ignore
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export default function LoginPage() {
	const toast = useToast();
	const [isLoading, setIsloading] = useState(false);

	const { handleChange, errors, values, handleSubmit, setFieldValue } =
		useFormik({
			initialValues: {
				email: '',
				password: '',
			},
			validationSchema: Yup.object().shape({
				email: Yup.string()
					.email('Surel Tidak Valid')
					.required('Wajib diisi'),
				password: Yup.string().required('Wajib diisi'),
			}),
			validateOnChange: false,
			validateOnBlur: false,

			onSubmit: (values) => {
				setIsloading(true);

				fetch(HOST_URL + '/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values),
				}).then((res) => {
					setIsloading(false);
					const url = new URL(res.url);
					if (!!url.searchParams.get('failed')) {
						toast({
							title: 'Akses ditolak',
							description: 'Alamat surel atau kata sandi tidak benar',
							status: 'error',
							position: 'top',
							variant: 'left-accent',
							isClosable: true,
						});
						setFieldValue('password', '');
						return;
					}

					window.location.href = res.url;
				});
			},
		});

	return (
		<Container maxW="full" bg="#378CE7" minH="100vh">
			<Container
				as={Flex}
				maxW="container.lg"
				minH="100vh"
				align="center"
				pb="80px"
			>
				<Box w="60%" color="gray.50">
					<HStack>
						<Center rounded="lg" boxSize="50px" bg="gray.50">
							<Image src={logo} />
						</Center>
						<Heading size="2xl">AtmosEye</Heading>
					</HStack>
					<Text fontSize="lg" mt="4" maxW="500px">
						Solusi pemantauan dan pendukung keputusan tentang kualitas
						udara dan emisi gas rumah kaca. Berdayakan bisnis,
						pemerintah, dan komunitas untuk memastikan lingkungan yang
						lebih bersih dan sehat.
					</Text>
				</Box>
				<Card w="40%" shadow="xl">
					<CardHeader pb="0" textAlign="center">
						<Heading size="lg">Login</Heading>
						<Text>Masukan informasi autentikasi di bawah ini</Text>
					</CardHeader>
					<CardBody>
						<form onSubmit={handleSubmit}>
							<VStack spacing="4">
								<FormControl isInvalid={Boolean(errors.email)}>
									<FormLabel>Alamat Surel</FormLabel>
									<Input
										id="email"
										name="email"
										autoComplete="email"
										placeholder="Contoh: suparna@gmail.com"
										onChange={handleChange}
									/>
									<FormErrorMessage>{errors.email}</FormErrorMessage>
								</FormControl>

								<FormControl isInvalid={Boolean(errors.password)}>
									<FormLabel>Kata Sandi</FormLabel>
									<InputPassword
										id="password"
										name="password"
										autoComplete="current-password"
										placeholder="Masukkan kata sandi"
										onChange={handleChange}
										value={values.password}
									/>

									<FormErrorMessage>
										{errors.password}
									</FormErrorMessage>
								</FormControl>
								<Button
									alignSelf="end"
									colorScheme="blue"
									type="submit"
									isLoading={isLoading}
								>
									Masuk
								</Button>
							</VStack>
						</form>
					</CardBody>
				</Card>
			</Container>
		</Container>
	);
}
