import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { API_URL } from '@/constants/config';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, RadioGroup, Text, Textarea, VStack } from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { trimAllValues } from '@/utils/common.utils';

import axios from 'axios';
import { MyRadio } from '@/components/common/MyRadio';
import RequiredIndicator from '@/components/Form/RequiredIndicator';
import { BigAlert } from '@/components/common/BigAlert';

export default function CreateUser() {
	const {
		handleChange,
		handleBlur,
		isSubmitting,
		setSubmitting,
		touched,
		resetForm,
		setFieldValue,
		values,
		status,
		setStatus,
		errors,
		handleSubmit,
	} = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			description: '',
			role: 'regular',
			address: '',
			profilePicture: '',
		},
		validationSchema: Yup.object().shape({
			name: valSchema.name.required('Wajib diisi'),
			phone: valSchema.phone.required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			description: valSchema.description.nullable(),
			email: valSchema.email.required('Wajib diisi'),
			role: Yup.string().required('Wajib diisi'),
		}),
		onSubmit: (values) => {
			axios
				.post(API_URL + '/users', trimAllValues(values))
				.then(({ data }) => setStatus(data.success))
				.catch(() => setStatus(false))
				.finally(() => setSubmitting(false));
		},
	});

	return (
		<Box>
			<Heading size="lg">Buat akun Pengguna</Heading>
			<Text>
				Buat Akun pengguna untuk memberikan akses orang lain ke sistem
			</Text>

			<Container maxW="container.sm" mt="6">
				{status !== undefined ? (
					status ? (
						<BigAlert
							status="success"
							title="Akun berhasil didaftarkan"
							description="Alamat email terdaftar akan menerima tautan verifikasi. &#10;&#13; Klik tautan tersebut untuk mengaktifkan akun dan menyelesaikan pendaftaran."
							onCreateAgain={resetForm}
						/>
					) : (
						<BigAlert
							status="warning"
							title="Akun gagal didaftarkan"
							description="Ada yang salah. Hubungi Administrator"
							onCreateAgain={resetForm}
						/>
					)
				) : (
					<form onSubmit={handleSubmit} className="my-form">
						<VStack mx="auto" spacing="2">
							<FormControl
								isInvalid={Boolean(errors.name) && touched.name}
							>
								<FormLabel>
									Nama <RequiredIndicator />
								</FormLabel>
								<Input
									id="name"
									name="name"
									placeholder="Misal : Suparna"
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<FormErrorMessage>{errors.name}</FormErrorMessage>
							</FormControl>
							<FormControl
								isInvalid={Boolean(errors.email) && touched.email}
							>
								<FormLabel>
									Email <RequiredIndicator />
								</FormLabel>
								<Input
									id="email"
									name="email"
									placeholder="Misal : suparna@gmail.com"
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<FormErrorMessage>{errors.email}</FormErrorMessage>
							</FormControl>
							<FormControl
								isInvalid={Boolean(errors.phone) && touched.phone}
							>
								<FormLabel>
									Nomor Telepon <RequiredIndicator />
								</FormLabel>
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
								<FormLabel>
									Alamat <RequiredIndicator />
								</FormLabel>
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
								isInvalid={
									Boolean(errors.description) && touched.description
								}
							>
								<FormLabel>Description</FormLabel>
								<Textarea
									id="description"
									name="description"
									placeholder="Opsional"
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<FormErrorMessage>
									{errors.description}
								</FormErrorMessage>
							</FormControl>
							<FormControl
								isInvalid={Boolean(errors.role) && touched.role}
							>
								<FormLabel>
									Peran pengguna <RequiredIndicator />
								</FormLabel>
								<RadioGroup
									onChange={(e) => setFieldValue('role', e)}
									value={values.role}
								>
									<HStack spacing={4} direction="row">
										<MyRadio value="regular">Reguler</MyRadio>
										<MyRadio value="manager">Manager</MyRadio>
										<MyRadio value="admin">Admin</MyRadio>
										<MyRadio value="gov">Pemerintah</MyRadio>
									</HStack>
								</RadioGroup>

								<FormErrorMessage>{errors.role}</FormErrorMessage>
							</FormControl>

							<FormControl
								isInvalid={
									Boolean(errors.profilePicture) &&
									touched.profilePicture
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
								<FormErrorMessage>
									{errors.profilePicture}
								</FormErrorMessage>
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
				)}
			</Container>
		</Box>
	);
}
