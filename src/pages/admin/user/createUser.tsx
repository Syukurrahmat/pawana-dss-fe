import { API_URL } from '@/config';
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Text,
	Textarea,
	VStack,
	useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { userValidationSchema } from './userValidationSchema';

export default function CreateUser() {
	const [isloading, setIsloading] = useState(false);

	const toast = useToast();

	const { handleChange, values, errors, handleSubmit } = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			description: '',
			address: '',
			profilePicture: '',
		},
		validationSchema: userValidationSchema(),
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: (values) => {
			setIsloading(true);
			fetch(API_URL + '/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			})
				.then((e) => e.json())
				.then((res) => {
					setIsloading(false);

					if (!res.success) {
						toast({
							title: `Gagal`,
							description: res.message,
							variant: 'solid',
							status: 'error',
							isClosable: true,
							position: 'top-right',
							containerStyle: {
								margin: '30px 20px 0 0',
							},
						});
					} else {
						toast({
							title: `Sukses`,
							description:
								'Pengguna diminta untuk melakukan verifikasi melalui tautan yang baru saja kami kirimkan melalui surel.',
							variant: 'solid',
							status: 'success',
							isClosable: true,
							position: 'top-right',
							containerStyle: {
								margin: '30px 20px 0 0',
							},
						});
					}
				});
		},
	});
	return (
		<>
			<Heading size="lg">Buat akun Pengguna</Heading>
			<Text>
				Buat Akun pengguna untuk memberikan akses orang lain ke DSS ini
			</Text>
			<form
				onSubmit={handleSubmit}
				style={{ marginTop: '1.5em' }}
				className="my-form"
			
			>
				<VStack mx="auto" spacing="2" maxW="container.sm" mt="4">
					<FormControl isInvalid={Boolean(errors.name)}>
						<FormLabel>Nama</FormLabel>
						<Input
							id="name"
							name="name"
							placeholder="Misal : Suparna"
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.email)}>
						<FormLabel>Email</FormLabel>
						<Input
							id="email"
							name="email"
							placeholder="Misal : suparna@gmail.com"
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.email}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.phone)}>
						<FormLabel>Nomor Telepon</FormLabel>
						<Input
							id="phone"
							name="phone"
							placeholder="Misal : 087812345678"
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.phone}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.address)}>
						<FormLabel>Alamat</FormLabel>
						<Textarea
							id="address"
							name="address"
							placeholder="Masukkan Alamat Tempat tinggal Pengguna"
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.address}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.description)}>
						<FormLabel>Description</FormLabel>
						<Textarea
							id="description"
							name="description"
							placeholder="Opsional"
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.description}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={Boolean(errors.profilePicture)}>
						<FormLabel>Foto Profil</FormLabel>
						<Input
							type="file"
							id="profilePicture"
							name="profilePicture"
							onChange={handleChange}
							accept="image/*"
							isDisabled={true}
						/>
						<FormErrorMessage>{errors.profilePicture}</FormErrorMessage>
					</FormControl>
					<Button
						isLoading={isloading}
						w="full"
						mt="4"
						colorScheme="green"
						type="submit"
						children="Buat Akun"
					/>
				</VStack>
			</form>
		</>
	);
}
