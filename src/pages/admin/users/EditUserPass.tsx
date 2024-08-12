import InputPassword from '@/components/Form/inputPassword';
import { API_URL } from '@/constants/config';
import { trimAllValues, usemyToasts } from '@/utils/common.utils';
import * as valSchema from '@/utils/validator.utils';
import { Button, ButtonProps, FormControl, FormErrorMessage, FormLabel, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconCircleCheck, IconExclamationCircle } from '@tabler/icons-react'; //prettier-ignore
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import { myAxios } from '@/utils/fetcher';
import axios, { AxiosError } from 'axios';
import PasswordChecklist from 'react-password-checklist';

interface IEUModal extends ButtonProps {
	data: UserDataPage;
}

export default function EditPasswordButton({ data, ...rest }: IEUModal) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = usemyToasts();
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
		setFieldError,
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
				setSubmitting(false);
				toast.opss('Masukan kata sandi baru sesuai intruksi');
				return;
			}

			const { password, newPassword } = trimAllValues(values);

			myAxios
				.patch(`/users/${userId}/`, { password, newPassword })
				.then(() => {
					toast.success('Berhasil Memperharui kata sandi');
					onClose();
				})
				.catch((e: AxiosError) => {
					if (e.response?.status === 401) {
						setFieldError('password', 'Kata sandi salah');
					} else {
						toast.error('Gagal Memperharui kata sandi');
						onClose();
					}
				})
				.finally(() => {
					setSubmitting(false);
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
