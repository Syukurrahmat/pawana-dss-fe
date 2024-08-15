
import useUser from '@/hooks/useUser';
import {
	compareObjects,
	toastErrorOpt,
	toastSuccessOpt,
	trimAndCleanProps,
	useMyToasts,
} from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import * as valSchema from '@/utils/validator.utils';
import { Button, ButtonProps, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, UseToastOptions, VStack, useDisclosure, useToast } from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { useMatch, useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';
import * as Yup from 'yup';

interface IEUModal extends ButtonProps {
	data: UserDataPage;
	mutate: KeyedMutator<UserDataPage>;
}

export default function EditUserProfileButton({
	data,
	mutate,
	...rest
}: IEUModal) {
	const { name, phone, description, address } = data;
	const initialValues = { name, phone, description, address };
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { id } = useParams();
	const { user } = useUser();
	const toast = useMyToasts();

	const userId = useMatch('/account') ? user.userId : id;

	const {
		values,
		errors,
		touched,
		isSubmitting,
		handleSubmit,
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
			trimAndCleanProps(values);
			const updatedData = compareObjects(initialValues, values);

			if (Object.keys(updatedData).length === 0) {
				toast.opss('Belum ada yang disunting');
				setSubmitting(false);
				return;
			}

			myAxios
				.patch(`/users/${userId}/`, { ...updatedData })
				.then(() => {
					toast.success('Berhasil Memperharui data');
					mutate((e) => (e ? { ...e, ...updatedData } : e));
				})
				.catch(() => {
					toast.error('Gagal Memperharui data');
				})
				.finally(() => {
					setSubmitting(false);
					onClose();
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
							</VStack>
						</ModalBody>

						<ModalFooter>
							<Button
								variant="ghost"
								onClick={() => {
									resetForm();
									onClose();
								}}
							>
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
