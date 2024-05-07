import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, VStack, FormControl, FormLabel, Input, FormErrorMessage, Textarea, useToast, useDisclosure, ButtonProps} from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { compareObjects, trimAllValues } from '@/utils/index.utils';
import { API_URL } from '@/constants/config';
import { KeyedMutator } from 'swr';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface IEUModal extends ButtonProps {
	data: { [key: string]: string };
	mutate: KeyedMutator<any>;
}

export default function EditUserProfileButton({
	data,
	mutate,
	...rest
}: IEUModal) {
	const { name, phone, description, address, profilePicture } = data;
	const initialValues = { name, phone, description, address, profilePicture };
	const { isOpen, onOpen, onClose } = useDisclosure(); 
	const { id } = useParams();
	const toast = useToast();

	const {
		values,
		errors,
		touched,
		isSubmitting,
		handleSubmit,
		setValues,
		handleBlur,
		resetForm,
		handleChange,
		setSubmitting,
	} = useFormik({
		initialValues,
		validationSchema: Yup.object().shape({
			name: valSchema.name.required('Wajib diisi'),
			phone: valSchema.phone.required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			description: valSchema.description.nullable(),
		}),

		onSubmit: (values) => {
			trimAllValues(values);

			const filteredData = compareObjects(initialValues, values);

			if (Object.keys(filteredData).length === 0) {
				toast({
					title: `Opss !!!`,
					description: 'Belum ada yang disunting',
					status: 'warning',
				});
				setSubmitting(false);
				return;
			}

			axios
				.put(`${API_URL}/users/${id}/`, {
					...filteredData,
				})
				.then(({ data }) => {
					setSubmitting(false);

					if (!data.success) {
						toast({
							title: `Gagal`,
							description: data.message,
							status: 'error',
						});
					} else {
						toast({
							title: `Sukses`,
							description: data.message,
							status: 'success',
						});
						mutate();
						onClose();
					}
				});
		},
	});

	return (
		<>
			<Button onClick={onOpen} {...rest} />

			<Modal
				size="lg"
				autoFocus={false}
				isOpen={isOpen}
				onClose={onClose}
				// onCloseComplete={resetForm}
				closeOnOverlayClick={false}
			>
				<ModalOverlay />
				<ModalContent>
					<form onSubmit={handleSubmit} className="my-form">
						<ModalHeader>Sunting Profil</ModalHeader>
						<ModalBody>
							<VStack mx="auto" spacing="2" maxW="container.sm">
								<FormControl
									isInvalid={Boolean(errors.name) && touched.name}
								>
									<FormLabel>Nama</FormLabel>
									<Input
										id="name"
										name="name"
										placeholder="Misal : Suparna"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.name}
									/>
									<FormErrorMessage>{errors.name}</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={Boolean(errors.phone) && touched.phone}
								>
									<FormLabel>Nomor Telepon</FormLabel>
									<Input
										id="phone"
										name="phone"
										placeholder="Misal : 087812345678"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.phone}
									/>
									<FormErrorMessage>{errors.phone}</FormErrorMessage>
								</FormControl>
								<FormControl
									isInvalid={
										Boolean(errors.address) && touched.address
									}
								>
									<FormLabel>Alamat</FormLabel>
									<Textarea
										id="address"
										name="address"
										placeholder="Masukkan Alamat Tempat tinggal Pengguna"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.address}
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
										value={values.description}
									/>
									<FormErrorMessage>
										{errors.description}
									</FormErrorMessage>
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
							</VStack>
						</ModalBody>

						<ModalFooter>
							<Button variant="ghost" onClick={()=>{
								setValues(initialValues)
								onClose()
							}}>
								Batal
							</Button>
							<Button
								isLoading={isSubmitting}
								type="submit"
								colorScheme="blue"
								ml={3}
							>
								Submit
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</>
	);
}
