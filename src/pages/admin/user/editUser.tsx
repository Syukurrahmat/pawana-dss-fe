import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, VStack, FormControl, FormLabel, Input, FormErrorMessage, Textarea, useToast} from '@chakra-ui/react'; //prettier-ignore
import { userValidationSchema } from './userValidationSchema';
import { useFormik } from 'formik';
import { compareObjects } from '@/utils/index.utils';
import { useState } from 'react';
import { API_URL } from '@/config';
import { KeyedMutator } from 'swr';

interface IEUModal {
	isOpen: boolean;
	onClose: () => void;
	data: { [key: string]: string };
	mutate : KeyedMutator<any>

}

export default function EditUserModal({
	isOpen,
	onClose,
	data,
	mutate,
	...rest
}: IEUModal) {
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const { name, phone, description, address, profilePicture } = data;
	const initialValues = { name, phone, description, address, profilePicture };

	const { handleChange, values, errors, handleSubmit, resetForm } = useFormik({
		initialValues,
		validationSchema: userValidationSchema(false),
		validateOnChange: false,
		validateOnBlur: false,

		onSubmit: (values) => {
			const filteredData = compareObjects(
				{ name, phone, description, address, profilePicture },
				values
			);

			if (Object.keys(filteredData).length === 0) {
				toast({
					title: `Opss !!!`,
					description: 'Belum ada yang disunting',
					variant: 'left-accent',
					status: 'warning',
					isClosable: true,
					position: 'top-right',
					containerStyle: {
						margin: '30px 30px 0 0',
					},
				});
				return;
			}
			setIsLoading(true);

			fetch(API_URL + '/users/', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...filteredData, userId: data.userId }),
			})
				.then((e) => e.json())
				.then((res) => {
					setIsLoading(false);

					if (!res.success) {
						toast({
							title: `Gagal`,
							description: res.message,
							variant: 'solid',
							status: 'error',
							isClosable: true,
							position: 'top-right',
							containerStyle: {
								margin: '30px 30px 0 0',
							},
						});
					} else {
						toast({
							title: `Sukses`,
							description: res.message,
							variant: 'solid',
							status: 'success',
							isClosable: true,
							position: 'top-right',
							containerStyle: {
								margin: '30px 30px 0 0',
							},
						});
						mutate();
						onClose();
					}
				});
		},
	});

	return (
		<Modal
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
			onCloseComplete={resetForm}
			{...rest}
			closeOnOverlayClick={false}
		>
			<ModalOverlay />
			<ModalContent>
				<form onSubmit={handleSubmit} className="my-form">
					<ModalHeader>Sunting Profil</ModalHeader>
					<ModalBody>
						<VStack mx="auto" spacing="2" maxW="container.sm">
							<FormControl isInvalid={Boolean(errors.name)}>
								<FormLabel>Nama</FormLabel>
								<Input
									id="name"
									name="name"
									placeholder="Misal : Suparna"
									onChange={handleChange}
									value={values.name}
								/>
								<FormErrorMessage>{errors.name}</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={Boolean(errors.phone)}>
								<FormLabel>Nomor Telepon</FormLabel>
								<Input
									id="phone"
									name="phone"
									placeholder="Misal : 087812345678"
									onChange={handleChange}
									value={values.phone}
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
									value={values.address}
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
									value={values.description}
								/>
								<FormErrorMessage>
									{errors.description}
								</FormErrorMessage>
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
								<FormErrorMessage>
									{errors.profilePicture}
								</FormErrorMessage>
							</FormControl>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" onClick={onClose}>
							Batal
						</Button>
						<Button
							isLoading={isLoading}
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
	);
}
