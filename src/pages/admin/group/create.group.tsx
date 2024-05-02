import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
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
import { trimAllValues } from '@/utils/index.utils';
import axios from 'axios';

export default function CreateGroup() {
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
			description: '',
			address: '',
		},
		validationSchema: Yup.object().shape({
			name: valSchema.name.required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			description: valSchema.description.required('Wajib diisi'),
		}),
		onSubmit: (values) => {
			axios
				.post(API_URL + '/groups', trimAllValues(values))
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
			<Heading size="lg">Buat Grup</Heading>
			<Text>
				Buat Grup untuk dashboard suatu pabrik
			</Text>
			<form
				onSubmit={handleSubmit}
				style={{ marginTop: '1.5em' }}
				className="my-form"
			>
				<VStack mx="auto" spacing="2" maxW="container.sm" mt="4">
					<FormControl isInvalid={Boolean(errors.name) && touched.name}>
						<FormLabel>Nama Grup</FormLabel>
						<Input
							id="name"
							name="name"
							placeholder="Misal : Pabrik Bahagia"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
					</FormControl>
				 
					<FormControl
						isInvalid={Boolean(errors.address) && touched.address}
					>
						<FormLabel>Alamat Pabrik</FormLabel>
						<Textarea
							id="address"
							name="address"
							placeholder="Masukkan Alamat Pabrik"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.address}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(errors.description) && touched.description}
					>
						<FormLabel>Deskripsi</FormLabel>
						<Textarea
							id="description"
							name="description"
							placeholder="Masukkan deskripsi pabrik"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.description}</FormErrorMessage>
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
