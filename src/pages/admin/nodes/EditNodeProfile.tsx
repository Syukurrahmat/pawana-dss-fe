import { API_URL } from '@/constants/config';
import {
	compareObjects,
	trimAndCleanProps,
	useMyToasts,
} from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import * as valSchema from '@/utils/validator.utils';
import { Button, ButtonProps, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { KeyedMutator } from 'swr';
import * as Yup from 'yup';

interface IEUModal extends ButtonProps {
	data: NodeDataPage;
	mutate: KeyedMutator<NodeDataPage>;
}

export default function EditNodeProfileButton({
	data,
	mutate,
	...rest
}: IEUModal) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useMyToasts();
	const { name, description, address, instalationDate } = data;
	const initialValues = {
		name,
		description,
		address,
		instalationDate,
	};
	const { id: nodeId } = useParams();
	const submitURL = `${API_URL}/nodes/${nodeId}`;

	const {
		handleChange,
		values,
		errors,
		handleSubmit,
		handleBlur,
		resetForm,
		touched,
		isSubmitting,
		setSubmitting,
	} = useFormik({
		initialValues,
		validationSchema: Yup.object().shape({
			name: valSchema.name.required('Wajib diisi'),
			description: valSchema.description.required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			instalationDate: Yup.date().nullable(),
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
				.patch(submitURL, { ...updatedData })
				.then((e) => {
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
										Boolean(errors.address) && touched.address
									}
								>
									<FormLabel>Alamat</FormLabel>
									<Textarea
										id="address"
										name="address"
										placeholder="Opsional"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.address}
									/>
									<FormErrorMessage>{errors.address}</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={
										Boolean(errors.instalationDate) &&
										touched.instalationDate
									}
								>
									<FormLabel>Tanggal Instalasi</FormLabel>
									<Input
										id="instalationDate"
										name="instalationDate"
										type="date"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.instalationDate}
									/>
									<FormErrorMessage>
										{errors.instalationDate}
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
