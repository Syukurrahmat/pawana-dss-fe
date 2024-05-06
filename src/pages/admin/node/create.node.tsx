import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Heading,
	Input,
	Radio,
	RadioGroup,
	Stack,
	Text,
	Textarea,
	VStack,
	useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { trimAllValues } from '@/utils/index.utils';
import { IconChevronDown } from '@tabler/icons-react';
import SelectGroupInput from './selectGroup.node';
import { CoordinateGetter } from '@/components/maps/index.maps';

export default function CreateNode() {
	const toast = useToast();

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
			groupId: '',
			name: '',
			description: '',
			status: 'normal',
			environment: 'outdoor',
			latitude: undefined,
			longitude: undefined,
		},
		validationSchema: Yup.object().shape({
			groupId: Yup.string().required(
				'Anda Belum menentukan Grup yang akan ditautkan'
			),
			name: valSchema.name.required('Wajib diisi'),
			description: valSchema.description.required('Wajib diisi'),
			status: valSchema.nodeStatus.required('Wajib diisi'),
			environment: valSchema.environment.required('Wajib diisi'),
			latitude: Yup.number().required(
				'Anda Belum menentukan titik koordinat'
			),
			longitude: Yup.number().required(
				'Anda Belum menentukan titik koordinat'
			),
		}),
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 4));
			axios
				.post(API_URL + '/nodes', trimAllValues(values))
				.then(({ data }) => {
					console.log(data);

					setSubmitting(false);
					data.success
						? toast({
								title: `Sukses`,
								description: data.message,
								status: 'success',
						  })
						: toast({
								title: `Gagal`,
								description: data.message,
								status: 'error',
						  });
				});
		},
	});

	return (
		<>
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
					<FormControl
					>
						<FormLabel>Pilih Grup</FormLabel>
						<SelectGroupInput
							onChange={(e) => setFieldValue('groupId', e.groupId)}
						/>
						<FormErrorMessage>{errors.groupId}</FormErrorMessage>
					</FormControl>
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
						isInvalid={Boolean(errors.longitude) && touched.longitude}
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
								Boolean(errors.longitude) && touched.longitude
									? '2px solid'
									: ''
							}
							outlineColor="#E53E3E"
							overflow="hidden"
						>
							<Box className="map-marker-centered" />
							<MapContainer
								style={{
									height: '250px',
								}}
								boundsOptions={{ padding: [10, 10] }}
								zoom={13}
								scrollWheelZoom={false}
								center={[-7.474443, 110.244218]}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<CoordinateGetter
									onDragend={(x: any) => {
										setFieldValue('latitude', x.lat);
										setFieldValue('longitude', x.lng);
									}}
								/>
							</MapContainer>
						</Box>
						<FormErrorMessage>{errors.longitude}</FormErrorMessage>
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
								<Radio size="lg" value="normal">
									Normal
								</Radio>
								<Radio size="lg" value="maintenance">
									Dalam Pemeliharaan
								</Radio>
								<Radio size="lg" value="nonactive">
									Nonaktif
								</Radio>
							</Stack>
						</RadioGroup>
					</FormControl>
					<FormControl mt="3">
						<FormLabel>Letak Node</FormLabel>
						<RadioGroup
							id="environment"
							name="environment"
							onChange={(e) => setFieldValue('environment', e)}
							value={values.environment}
						>
							<Stack spacing="4" direction="row">
								<Radio size="lg" value="indoor">
									Indoor
								</Radio>
								<Radio size="lg" value="outdoor">
									Outdoor
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
		</>
	);
}

