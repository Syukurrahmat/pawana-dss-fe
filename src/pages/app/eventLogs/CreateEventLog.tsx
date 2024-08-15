import RequiredIndicator from '@/components/Form/RequiredIndicator';
import { API_URL } from '@/constants/config';
import { eventLogsTypeAttr } from '@/constants/enumVariable';

import useUser from '@/hooks/useUser';
import { trimAndCleanProps, useMyToasts } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import * as valSchema from '@/utils/validator.utils';
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Text, Textarea, VStack, useDisclosure, } from '@chakra-ui/react'; //prettier-ignore
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import { useFormik } from 'formik';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	name: valSchema.name.required('Wajib Diisi'),
	description: valSchema.description.required('Wajib Diisi'),
	type: Yup.string().required('Wajib Diisi'),
	status: Yup.string().required('Wajib Diisi'),
	location: Yup.string().nullable(),
});

export default function CreateEventLog() {
	const { user } = useUser();
	const companyId = user.view?.company?.companyId;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const toast = useMyToasts();
	const [onlyOneDayEvent, setOnlyOneDayEvent] = useState(false);
	const [withoutEndDate, setWithoutEndDate] = useState(false);

	const {
		handleChange,
		handleBlur,
		isSubmitting,
		values,
		setFieldValue,
		resetForm,
		touched,
		errors,
		handleSubmit,
	} = useFormik({
		initialValues: {
			name: '',
			description: '',
			status: 'inProgress',
			type: 'production',
			location: '',
			startDate: moment().format('YYYY-MM-DD'),
			endDate: moment().format('YYYY-MM-DD') as string | null,
			isCompleted: false,
		},
		validationSchema,
		onReset: () => {
			setOnlyOneDayEvent(false);
			setWithoutEndDate(false);
		},
		onSubmit: async (values) => {
			values.endDate = onlyOneDayEvent
				? values.startDate
				: withoutEndDate
				? null
				: values.endDate;

			const apiUrl = `/companies/${companyId}/events`;

			myAxios
				.post(apiUrl, trimAndCleanProps(values))
				.then(() => {
					toast.success('Kegiatan berhasil ditambahkan');
					mutate((e) => typeof e == 'string' && e.startsWith(apiUrl));
					onClose();
					resetForm();
				})
				.catch(() => {
					toast.error('Kegiatan gagal ditambahkan');
				});
		},
	});

	useEffect(() => {
		if (moment(values.endDate).isBefore(moment(values.startDate))) {
			setFieldValue('endDate', values.startDate);
		}
	}, [values.startDate]);

	useEffect(() => {
		if (moment(values.endDate).isAfter(moment())) {
			setFieldValue('isCompleted', false);
		}
	}, [values.endDate]);

	return (
		<>
			<Button
				leftIcon={<IconPlus size="20px" />}
				colorScheme="blue"
				children="Tambah Catatan"
				onClick={onOpen}
			/>

			<Modal
				size="2xl"
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior="inside"
				closeOnEsc={false}
				onCloseComplete={resetForm}
			>
				<form onSubmit={handleSubmit}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader borderBottom="1px solid" borderColor="gray.200">
							Catat Kegiatan
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack mx="auto" spacing="2" maxW="container.sm" my="4">
								<FormControl
									isInvalid={Boolean(errors.name) && touched.name}
								>
									<FormLabel>
										Nama Kegiatan <RequiredIndicator />
									</FormLabel>
									<Input
										id="name"
										name="name"
										placeholder="Misal : produksi tahu "
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<FormErrorMessage>{errors.name}</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={
										Boolean(errors.description) && touched.description
									}
								>
									<FormLabel>
										Deskripsi Kegiatan <RequiredIndicator />
									</FormLabel>
									<Textarea
										id="description"
										name="description"
										placeholder="Tulis deskripsi kegiatan, singkat saja"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<FormErrorMessage>
										{errors.description}
									</FormErrorMessage>
								</FormControl>
								<FormControl
									isInvalid={
										Boolean(errors.location) && touched.location
									}
								>
									<FormLabel>Tempat Kegiatan</FormLabel>
									<Input
										id="location"
										name="location"
										placeholder="Misal : Gudang "
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<FormErrorMessage>
										{errors.location}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={Boolean(errors.type) && touched.type}
								>
									<FormLabel>
										Jenis Kegiatan <RequiredIndicator />
									</FormLabel>
									<Select
										id="type"
										name="type"
										onChange={handleChange}
										onBlur={handleBlur}
										bg="white"
									>
										{Object.entries(eventLogsTypeAttr).map(
											([key, value]) => (
												<option key={key} value={key}>
													{value.name}
												</option>
											)
										)}
									</Select>
									<FormErrorMessage>{errors.type}</FormErrorMessage>
								</FormControl>

								<HStack w="full" align="start">
									<FormControl
										isInvalid={
											Boolean(errors.startDate) && touched.startDate
										}
									>
										<FormLabel>
											Tanggal dimulai <RequiredIndicator />
										</FormLabel>
										<Input
											id="startDate"
											name="startDate"
											type="date"
											placeholder="Misal : produksi tahu"
											value={values.startDate}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<HStack
											as="label"
											mt="2"
											align="center"
											cursor="pointer"
											w="fit-content"
										>
											<Switch
												isChecked={onlyOneDayEvent}
												onChange={(e) => {
													const { checked } = e.target;
													setOnlyOneDayEvent(checked);
													if (checked)
														setFieldValue(
															'endDate',
															values.startDate
														);
												}}
											/>
											<Text>Kegiatan hanya sehari</Text>
										</HStack>
										<FormErrorMessage>
											{errors.startDate}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										isInvalid={
											Boolean(errors.endDate) && touched.endDate
										}
									>
										<FormLabel>Tanggal berakhir</FormLabel>
										<Input
											id="endDate"
											name="endDate"
											type="date"
											min={values.startDate}
											isDisabled={withoutEndDate || onlyOneDayEvent}
											value={
												!withoutEndDate ? values.endDate || '' : ''
											}
											onChange={(e) =>
												setFieldValue('endDate', e.target.value)
											}
											onBlur={handleBlur}
										/>
										<HStack mt="2" spacing="4">
											<HStack
												as="label"
												cursor="pointer"
												w="fit-content"
											>
												<Switch
													isChecked={
														withoutEndDate && !onlyOneDayEvent
													}
													isDisabled={
														onlyOneDayEvent || values.isCompleted
													}
													onChange={(e) =>
														setWithoutEndDate(e.target.checked)
													}
												/>
												<Text
													color={
														!onlyOneDayEvent
															? 'inherit'
															: 'gray.400'
													}
													children="Atur nanti"
												/>
											</HStack>
										</HStack>

										<FormErrorMessage>
											{errors.endDate}
										</FormErrorMessage>
									</FormControl>
								</HStack>
								<HStack
									alignSelf="start"
									as="label"
									cursor="pointer"
									w="fit-content"
								>
									<Switch
										isChecked={values.isCompleted}
										isDisabled={moment(values.endDate)
											.startOf('d')
											.isAfter(moment())}
										onChange={(e) => {
											setFieldValue('isCompleted', e.target.checked);
										}}
									/>
									<Text>Kegiatan sudah selesai</Text>
								</HStack>
							</VStack>
						</ModalBody>
						<ModalFooter borderTop="1px solid" borderColor="gray.200">
							<Button
								onClick={() => {
									resetForm();
									onClose();
								}}
								children="Batal"
							/>
							<Button
								colorScheme="blue"
								ml={3}
								type="submit"
								isLoading={isSubmitting}
								children="Kirim"
							/>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
}
