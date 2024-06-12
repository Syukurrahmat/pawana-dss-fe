import { Box, Card, CardBody, CardHeader, Center, Container, Flex, HStack, Heading, Image, Text, VStack, FormControl, FormLabel, FormHelperText, Input, Button, InputGroup, InputRightElement, IconButton, useToast, FormErrorMessage, InputProps } from '@chakra-ui/react'; // prettier-ignore
import logo from '@/assets/icon.svg';
import { useState } from 'react';
import { HOST_URL } from '@/constants/config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputPassword from '@/components/Form/inputPassword';



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
				alert(JSON.stringify(values));
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
						<Heading size="2xl">Pawana</Heading>
					</HStack>
					<Text fontSize="lg" mt="4" maxW="500px">
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad
						quisquam quibusdam odio labore dignissimos. Vitae expedita
						corrupti, illum ullam quidem, nostrum excepturi ipsum
						accusamus porro laborum ea veritatis consectetur similique!
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
