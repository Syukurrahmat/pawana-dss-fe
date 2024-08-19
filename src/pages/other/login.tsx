import logo from '@/assets/icon-white.svg';
import InputPassword from '@/components/Form/inputPassword';
import { HOST_URL } from '@/constants/config';
import { Box, Button, Card, CardBody, CardHeader, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Image, Input, Text, VStack, useToast } from '@chakra-ui/react'; // prettier-ignore
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function LoginPage() {
	const toast = useToast();

	const {
		handleChange,
		errors,
		handleBlur,
		touched,
		values,
		handleSubmit,
		isSubmitting,
		handleReset,
	} = useFormik({
		initialValues: { email: '', password: '' },
		validationSchema: Yup.object().shape({
			email: Yup.string().email('Surel Tidak Valid').required('Wajib diisi'),
			password: Yup.string().required('Wajib diisi'),
		}),
		onSubmit: async (values) => {
			return axios
				.post(HOST_URL + '/auth/login', values)
				.then(() => {
					window.location.href = '/';
				})
				.catch(() => {
					toast({
						title: 'Akses ditolak',
						description: 'Alamat surel atau kata sandi tidak benar',
						status: 'error',
						position: 'top-right',
						variant: 'left-accent',
						isClosable: true,
					});
				});
		},
	});

	return (
		<Container
			maxW="full"
			bg="#378CE7"
			minH="100vh"
			as={VStack}
			justify="center"
		>
			<Container as={Flex} maxW="container.lg" align="start" pb="15">
				<Box w="60%" color="gray.50" py="6">
					<Image src={logo} h="60px" />
					<Text fontSize="lg" mt="4" maxW="500px">
						Solusi pemantauan dan pendukung keputusan tentang kualitas
						udara dan emisi gas rumah kaca. Berdayakan bisnis, pemerintah,
						dan komunitas untuk memastikan lingkungan yang lebih bersih
						dan sehat.
					</Text>
				</Box>
				<Card w="40%" shadow="xl">
					<CardHeader pb="0" textAlign="center">
						<Heading size="lg">Login</Heading>
						<Text>Masukan informasi autentikasi di bawah ini</Text>
					</CardHeader>
					<CardBody>
						<form onSubmit={handleSubmit} onReset={handleReset}>
							<VStack spacing="4">
								<FormControl
									isInvalid={Boolean(errors.email) && touched.email}
								>
									<FormLabel>Alamat Surel</FormLabel>
									<Input
										id="email"
										name="email"
										autoComplete="email"
										placeholder="Contoh: suparna@gmail.com"
										onBlur={handleBlur}
										onChange={handleChange}
									/>
									<FormErrorMessage>{errors.email}</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={
										Boolean(errors.password) && touched.password
									}
								>
									<FormLabel>Kata Sandi</FormLabel>
									<InputPassword
										id="password"
										name="password"
										autoComplete="current-password"
										placeholder="Masukkan kata sandi"
										onChange={handleChange}
										value={values.password}
										onBlur={handleBlur}
									/>

									<FormErrorMessage>
										{errors.password}
									</FormErrorMessage>
								</FormControl>
								<Button
									alignSelf="end"
									colorScheme="blue"
									type="submit"
									isLoading={isSubmitting}
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
