import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, VStack, FormControl, FormLabel, FormErrorMessage, useToast, useDisclosure, ButtonProps} from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { useState } from 'react';
import { API_URL } from '@/constants/config';
import InputPassword from '@/components/form/inputPassword';
import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { trimAllValues } from '@/utils/index.utils';
import PasswordChecklist from 'react-password-checklist';
import {
	IconCircleCheck,
	IconCornerDownLeft,
	IconExclamationCircle,
	IconOvalFilled,
} from '@tabler/icons-react';
import axios from 'axios';

interface IEUModal extends ButtonProps {
	data: { [key: string]: string };
}

export default function EditPasswordButton({ data, ...rest }: IEUModal) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [passwordIsValid, setPasswordIsValid] = useState(false);
	const { userId } = data;

	const {
		handleChange,
		handleBlur,
		values,
		touched,
		errors,
		isSubmitting,
		setSubmitting,
		handleSubmit,
		resetForm,
	} = useFormik({
		initialValues: {
			password: '',
			confirmPassword: '',
			newPassword: '',
		},
		validationSchema: Yup.object().shape({
			password: valSchema.password.required('Wajib diisi'),
		}),

		onSubmit: (values) => {
			if (!passwordIsValid) {
				toast({
					title: `Opss`,
					description: 'Masukan kata sandi baru sesuai intruksi',
					status: 'warning',
				});
				setSubmitting(false);
				return;
			}
			const { password, newPassword } = trimAllValues(values);
			axios
				.put(API_URL + '/users/', { password, newPassword, userId })
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
							variant: 'solid',
							status: 'success',
						});
						onClose();
					}
				});
		},
	});

	return (
		<>
			<Button onClick={onOpen} {...rest}/>
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
						<ModalHeader>Perbarui Kata Sandi</ModalHeader>
						<ModalBody>
							<VStack mx="auto" spacing="2" maxW="container.sm">
								<FormControl
									isInvalid={
										Boolean(errors.password) && touched.password
									}
								>
									<FormLabel>Kata sandi</FormLabel>
									<InputPassword
										id="password"
										name="password"
										autoComplete="password"
										placeholder="Masukkan kata sandi saat ini"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<FormErrorMessage>
										{errors.password}
									</FormErrorMessage>
								</FormControl>

								<FormControl>
									<FormLabel>Kata sandi Baru</FormLabel>
									<InputPassword
										id="newPassword"
										name="newPassword"
										placeholder="Masukkan kata sandi"
										onChange={handleChange}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Konfirmasi Kata Sandi</FormLabel>
									<InputPassword
										id="confirmPassword"
										name="confirmPassword"
										autoComplete="new-password"
										placeholder="Tulis ulang kata sandi anda"
										onChange={handleChange}
									/>
								</FormControl>
								<PasswordChecklist
									style={{ width: '100%', marginTop: '0.5em' }}
									rules={['minLength', 'number', 'capital', 'match']}
									minLength={8}
									value={values.newPassword}
									valueAgain={values.confirmPassword}
									onChange={setPasswordIsValid}
									messages={{
										minLength:
											'Kata sandi harus lebih dari 8 karakter',
										number: 'Kata sandi harus mengandung angka',
										capital:
											'Kata sandi harus mengandung huruf kapital',
										match: 'Tulis ulang kata sandi',
									}}
									iconComponents={{
										ValidIcon: (
											<IconCircleCheck
												color="green"
												size="20"
												style={{ margin: '3px 5px 0 0' }}
											/>
										),
										InvalidIcon: (
											<IconExclamationCircle
												color="red"
												size="20"
												style={{ margin: '3px 5px 0 0' }}
											/>
										),
									}}
								/>
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
