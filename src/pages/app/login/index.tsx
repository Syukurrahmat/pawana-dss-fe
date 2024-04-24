import { Box, Card, CardBody, CardHeader, Center, Container, Flex, HStack, Heading, Image, Text, VStack, FormControl, FormLabel, FormHelperText, Input, Button, InputGroup, InputRightElement, IconButton, useToast } from '@chakra-ui/react'; // prettier-ignore
import logo from '@/assets/icon.svg';
import { useState } from 'react';
import { isEmail } from 'validator';
import { API_URL } from '@/config';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function LoginPage() {
	const toast = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [isLoading, setIsloading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const submitHandler = (e: any) => {
		e.preventDefault();

		setEmail((e) => e.trim());
		setPassword((e) => e.trim());

		setEmailError(isEmail(email) ? '' : 'Alamat surel tidak valid');
		setPasswordError(password ? '' : 'Kata sandi tidak boleh kosong');

		if (!isEmail(email) || !password) return;

		setIsloading(true);

		fetch(HOST_URL + '/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: email.toLowerCase(),
				password: password.toLowerCase(),
			}),
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

				setPassword('');
				return;
			}

			window.location.href = res.url;
		});
	};

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
						<VStack as="form" onSubmit={submitHandler}>
							<FormControl isInvalid={Boolean(emailError)}>
								<FormLabel>Alamat Surel</FormLabel>
								<Input
									name="email"
									placeholder="Contoh: suparna@gmail.com"
									onChange={(e) => {
										setEmail(e.target.value);
										setEmailError('');
									}}
									value={email}
								/>
								<FormHelperText color="red" h="16px">
									{emailError}
								</FormHelperText>
							</FormControl>

							<FormControl isInvalid={Boolean(passwordError)}>
								<FormLabel>Kata Sandi</FormLabel>
								<InputGroup>
									<Input
										pr="3.5rem"
										type={showPassword ? 'text' : 'password'}
										name="current-password"
										value={password}
										placeholder="Masukkan kata sandi"
										onChange={(e) => {
											setPassword(e.target.value);
											setPasswordError('');
										}}
									/>
									<InputRightElement
										width="3.5rem"
										onMouseDown={() => setShowPassword(true)}
										onMouseUp={() => setShowPassword(false)}
										onMouseLeave={() => setShowPassword(false)}
									>
										<IconButton
											size="sm"
											variant="ghost"
											aria-label={
												showPassword
													? 'Sembunyikan kata sandi'
													: 'Lihat kata sandi'
											}
											icon={
												showPassword ? (
													<IconEyeOff size="20px" />
												) : (
													<IconEye size="20px" />
												)
											}
										/>
									</InputRightElement>
								</InputGroup>
								<FormHelperText color="red" h="16px">
									{passwordError}
								</FormHelperText>
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
					</CardBody>
				</Card>
			</Container>
		</Container>
	);
}
