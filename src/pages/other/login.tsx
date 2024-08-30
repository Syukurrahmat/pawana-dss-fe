import logo from '@/assets/icon-white.svg';
import InputPassword from '@/components/Form/inputPassword';
import { HOST_URL } from '@/constants/config';
import { Box, BoxProps, Button, Card, CardBody, CardHeader, Center, Container, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Image, Input, Text, VStack, useToast } from '@chakra-ui/react'; // prettier-ignore
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

	const SupportedBy = (p: BoxProps) => (
		<Box color="gray.50" {...p}>
			<Text fontWeight="600">Supported by :</Text>
			<Text>
				Yanmar Environmental Sustainability Support Association (YESSA),
				Jepang
			</Text>
		</Box>
	);

	return (
		<Container
			maxW="full"
			bg="#378CE7"
			minH="100vh"
			as={Center}
			alignItems="start"
			flexDirection="column"
		>
			<Container maxW="container.lg">
				<HStack
					flexDirection={{ base: 'column', lg: 'row' }}
					align={{ base: 'strech', lg: 'center' }}
					justify="space-between"
					gap="8"
				>
					<VStack
						align="start"
						spacing="6"
						color="gray.50"
						flexGrow="2"
						maxW={{ lg: '500px' }}
					>
						<Box>
							<Image src={logo} h="60px" />
							<Text fontSize="lg" mt="4">
								Solusi pemantauan dan pendukung keputusan tentang
								kualitas udara dan emisi gas rumah kaca. Berdayakan
								bisnis, pemerintah, dan komunitas untuk memastikan
								lingkungan yang lebih bersih dan sehat.
							</Text>
						</Box>
						<SupportedBy display={{ base: 'none', lg: 'initial' }} />
					</VStack>
					<Card
						size="lg"
						rounded="md"
						minW="320px"
						shadow="xl"
						flexGrow="2"
					>
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
										<FormErrorMessage>
											{errors.email}
										</FormErrorMessage>
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
				</HStack>
				<Box my="8">
					<SupportedBy display={{ base: 'initial', lg: 'none' }} />
				</Box>
			</Container>
		</Container>
	);
}
