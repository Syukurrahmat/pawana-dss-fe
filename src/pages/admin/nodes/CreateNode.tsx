import { Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Text, Textarea, VStack, useToast } from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { MapContainer, TileLayer } from 'react-leaflet';
import { CoordinateGetter } from '@/components/maps/index.maps';
import { API_URL } from '@/constants/config';
import { trimAllValues } from '@/utils/common.utils';
 
import axios from 'axios';
import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

export default function CreateNode() {
	const {apiResponseToast} = useApiResponseToast();

	const {
		handleChange,
		handleBlur,
		isSubmitting,
		setSubmitting,
		touched,
		setFieldValue,
		values,
		errors,
		handleSubmit,
	} = useFormik({
		initialValues: {
			name: '',
			description: '',
			address: '',
			status: 'active',
			instalationDate: '',
			coordinate: [NaN, NaN],
		},
		validationSchema: Yup.object().shape({
			name: valSchema.name.required('Wajib diisi'),
			description: valSchema.description.required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			status: valSchema.nodeStatus.required('Wajib diisi'),

			instalationDate: Yup.date().nullable(),
			latitude: Yup.number().required(
				'Anda Belum menentukan titik koordinat'
			),
			longitude: Yup.number().required(
				'Anda Belum menentukan titik koordinat'
			),
		}),
		onSubmit: (values) => {
			alert(JSON.stringify(values));
			axios
				.post(`${API_URL}/nodes`, trimAllValues(values))
				.then(({ data }) => {
					setSubmitting(false);
					apiResponseToast(toast, data);
				});
		},
	});

	return (
		<Box>
			<Heading size="lg">Buat Grup</Heading>
			<Text>Buat Grup untuk dashboard suatu pabrik</Text>
			<form
				onSubmit={handleSubmit}
				style={{ marginTop: '1.5em' }}
				className="my-form"
			>
				<VStack
					mx="auto"
					spacing="2"
					maxW="container.sm"
					mt="4"
					pb="1000px"
				>
					<FormControl isInvalid={Boolean(errors.name) && touched.name}>
						<FormLabel>Nama Node</FormLabel>
						<Input
							id="name"
							name="name"
							placeholder="Misal : Belakang rumah pak Subegja"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={Boolean(errors.description) && touched.description}
					>
						<FormLabel>Deskripsi node</FormLabel>
						<Textarea
							id="description"
							name="description"
							placeholder="Masukkan deskripsi node, singkat saja"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.description}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(errors.address) && touched.address}
					>
						<FormLabel>Alamat node</FormLabel>
						<Textarea
							id="address"
							name="address"
							placeholder="Masukkan Alamat Node berada"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.address}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(errors.coordinate) && touched.coordinate}
					>
						<FormLabel>Koordinat Node</FormLabel>
						<FormHelperText>
							Geser peta dan paskan penanda ke titik yang dimaksud
						</FormHelperText>
						<Box
							mt="3"
							shadow="xs"
							rounded="md"
							position="relative"
							outline={
								Boolean(errors.coordinate) && touched.coordinate
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
										setFieldValue('coordinate', [x.lat, x.lng]);
									}}
								/>
							</MapContainer>
						</Box>
						<FormErrorMessage>{errors.coordinate}</FormErrorMessage>
					</FormControl>
					<FormControl mt="3">
						<FormLabel>Tanggal Instalasi</FormLabel>
						<Input
							w="fit-content"
							type="date"
							id="instalationDate"
							name="instalationDate"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
					</FormControl>
					<FormControl mt="3">
						<FormLabel>Status Node</FormLabel>
						<RadioGroup
							id="status"
							name="status"
							onChange={(e) => setFieldValue('status', e)}
							value={values.status}
						>
							<Stack spacing="4" direction="row">
								<Radio size="lg" value="active">
									Aktif
								</Radio>
								<Radio size="lg" value="nonactive">
									Nonaktif
								</Radio>
							</Stack>
						</RadioGroup>
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
		</Box>
	);
}
