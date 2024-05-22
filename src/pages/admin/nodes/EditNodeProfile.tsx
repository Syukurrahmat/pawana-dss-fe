import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, VStack, FormControl, FormLabel, Input, FormErrorMessage, Textarea, useToast, useDisclosure, ButtonProps} from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { compareObjects, trimAllValues } from '@/utils/common.utils';
import { API_URL } from '@/constants/config';
import { KeyedMutator } from 'swr';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

interface IEUModal extends ButtonProps {
	data: NodeDataPage;
	mutate: KeyedMutator<any>;
}

export default function EditNodeProfileButton({
	data,
	mutate,
	...rest
}: IEUModal) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { apiResponseToast, toast } = useApiResponseToast();
	const { name, description } = data;
	const initialValues = { name, description };
	const { id: nodeId } = useParams();

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
				.put(`${API_URL}/nodes/${nodeId}`, {
					...filteredData,
					nodeId: data.nodeId,
				})
				.then(({ data }) => {
					setSubmitting(false);
					apiResponseToast(data, {
						onSuccess() {
							mutate();
							onClose();
						},
					});
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
				onCloseComplete={resetForm}
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
							</VStack>
						</ModalBody>

						<ModalFooter>
							<Button variant="ghost" onClick={onClose}>
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
