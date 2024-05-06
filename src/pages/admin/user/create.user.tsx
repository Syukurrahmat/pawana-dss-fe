import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { API_URL } from '@/constants/config';
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
import { trimAllValues } from '@/utils/index.utils';
import axios from 'axios';

export default function CreateUser() {
	const toast = useToast();

	const {
		handleChange,
		handleBlur,
		isSubmitting,
		setSubmitting,
		touched,
		errors,
		handleSubmit,
	} = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			description: '',
			address: '',
			profilePicture: '',
		},
		validationSchema: Yup.object().shape({
			name: valSchema.name.required('Wajib diisi'),
			phone: valSchema.phone.required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			description: valSchema.description.nullable(),
			email: valSchema.email.required('Wajib diisi'),
		}),
		onSubmit: (values) => {
			axios
				.post(API_URL + '/users', trimAllValues(values))
				.then(({ data }) => {
					console.log(data);

					setSubmitting(false);
					data.success
						? toast({
								title: `Sukses`,
								description: data.message,
								status: 'success',
						  })
						: toast({
								title: `Gagal`,
								description: data.message,
								status: 'error',
						  });
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
					<FormControl isInvalid={Boolean(errors.name) && touched.name}>
						<FormLabel>Nama</FormLabel>
						<Input
							id="name"
							name="name"
							placeholder="Misal : Suparna"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.email) && touched.email}>
						<FormLabel>Email</FormLabel>
						<Input
							id="email"
							name="email"
							placeholder="Misal : suparna@gmail.com"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.email}</FormErrorMessage>
					</FormControl>
					<FormControl isInvalid={Boolean(errors.phone) && touched.phone}>
						<FormLabel>Nomor Telepon</FormLabel>
						<Input
							id="phone"
							name="phone"
							placeholder="Misal : 087812345678"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.phone}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(errors.address) && touched.address}
					>
						<FormLabel>Alamat</FormLabel>
						<Textarea
							id="address"
							name="address"
							placeholder="Masukkan Alamat Tempat tinggal Pengguna"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.address}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(errors.description) && touched.description}
					>
						<FormLabel>Description</FormLabel>
						<Textarea
							id="description"
							name="description"
							placeholder="Opsional"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.description}</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={
							Boolean(errors.profilePicture) && touched.profilePicture
						}
					>
						<FormLabel>Foto Profil</FormLabel>
						<Input
							type="file"
							id="profilePicture"
							name="profilePicture"
							onChange={handleChange}
							onBlur={handleBlur}
							accept="image/*"
							isDisabled={true}
						/>
						<FormErrorMessage>{errors.profilePicture}</FormErrorMessage>
					</FormControl>
					<Button
						isLoading={isSubmitting}
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
