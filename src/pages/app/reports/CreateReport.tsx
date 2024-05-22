import * as Yup from 'yup';
import {  FormControl, FormErrorMessage, FormLabel, Textarea, VStack, useToast, Avatar, Box, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, Button, ModalBody, ModalCloseButton, FormHelperText, } from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { IconSend } from '@tabler/icons-react';
import StarRating from '@/components/Rating';
import { toBase64, trimAllValues } from '@/utils/common.utils';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { PhotosPicker } from '../../../components/common/PhotosPicker';
import { MapContainer, TileLayer } from 'react-leaflet';
import { CoordinateGetter } from '@/components/maps/index.maps';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

export default function CreateReport() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { toast, apiResponseToast } = useApiResponseToast();

	const {
		handleChange,
		handleBlur,
		isSubmitting,
		values,
		setFieldValue,
		setSubmitting,
		resetForm,
		touched,
		errors,
		handleSubmit,
	} = useFormik({
		initialValues: {
			message: '',
			rating: 0,
			coordinate: [] as number[],
			images: [null, null, null] as (File | null)[],
		},
		validationSchema: Yup.object().shape({
			message: Yup.string()
				.max(255, 'Terlalu Panjang')
				.required('Wajib Diisi'),
			rating: Yup.number().required('Wajib Diisi'),
			coordinate: Yup.array(Yup.number()).required(
				'Anda Belum menentukan titik koordinat'
			),
		}),
		onSubmit: async (values) => {
			const images = await Promise.all(
				values.images.filter((e) => e as File).map((e) => toBase64(e))
			);

			const data = trimAllValues({ ...values, images });

			axios.post(API_URL + '/reports', data).then(({ data }) => {
				setSubmitting(false);
				apiResponseToast(data);
			});
		},
	});

	return (
		<>
			<HStack
				spacing="4"
				rounded="md"
				border="1px solid"
				borderColor="gray.200"
				bg="white"
				py="3"
				px="4"
				w="full"
				color="gray.500"
				justifyContent="start"
				cursor="pointer"
				onClick={onOpen}
			>
				<Avatar boxSize="35px" name="saya R" />
				<Box
					fontWeight="400"
					shadow="xs"
					px="4"
					py="2"
					w="full"
					rounded="md"
					children="Buat Laporan"
				/>
				<IconSend />
			</HStack>
			<Modal
				size="2xl"
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior="inside"
				closeOnEsc={false}
			>
				<form onSubmit={handleSubmit}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader borderBottom="1px solid" borderColor="gray.200">
							Posting Laporan
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack mx="auto" spacing="2" maxW="container.sm" mt="4">
								<FormControl
									isInvalid={
										Boolean(errors.message) && touched.message
									}
								>
									<FormLabel>Tuis Pesan</FormLabel>
									<Textarea
										id="message"
										name="message"
										placeholder="Tulis kuaitas udara yang anda rasakan saat ini"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<FormErrorMessage>{errors.message}</FormErrorMessage>
								</FormControl>
								<FormControl
									isInvalid={Boolean(errors.rating) && touched.rating}
								>
									<FormLabel>Pilih Bintang</FormLabel>
									<StarRating
										rating={values.rating}
										setRating={(e) => setFieldValue('rating', e)}
										size={2}
									/>

									<FormErrorMessage>{errors.rating}</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={
										Boolean(errors.coordinate) && touched.coordinate
									}
								>
									<FormLabel>Lokasi </FormLabel>
									<FormHelperText>
										Geser peta dan paskan penanda ke titik yang
										dimaksud
									</FormHelperText>
									<Box
										mt="3"
										shadow="xs"
										rounded="md"
										position="relative"
										outline={
											Boolean(errors.coordinate) &&
											touched.coordinate
												? '2px solid'
												: ''
										}
										outlineColor="#E53E3E"
										overflow="hidden"
									>
										<Box className="map-marker-centered" />
										<MapContainer
											style={{ height: '300px' }}
											boundsOptions={{ padding: [10, 10] }}
											zoom={13}
											scrollWheelZoom={false}
											center={[-7.519794, 110.082142]}
										>
											<TileLayer
												attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
												url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											/>
											<CoordinateGetter
												onDragend={(x: any) => {
													setFieldValue('coordinate', [
														x.lat,
														x.lng,
													]);
												}}
											/>
										</MapContainer>
									</Box>
									<FormErrorMessage>
										{errors.coordinate}
									</FormErrorMessage>
								</FormControl>
								<FormControl
									isInvalid={Boolean(errors.images) && touched.images}
								>
									<FormLabel>Foto</FormLabel>
									<PhotosPicker
										values={values.images}
										onChange={(e) => setFieldValue('images', e)}
									/>

									<FormErrorMessage>{errors.images}</FormErrorMessage>
								</FormControl>
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
