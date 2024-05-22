import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { API_URL } from '@/constants/config';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Text, Textarea, VStack } from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { trimAllValues } from '@/utils/common.utils';
import axios from 'axios';
import SelectManagerInput from '@/components/common/SelectManagerInput';
import { IconUserBolt } from '@tabler/icons-react';
import { companyTypeAttr } from '@/constants/enumVariable';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
export default function CreateCompany() {
	const { apiResponseToast } = useApiResponseToast();

	const {
		handleChange,
		handleBlur,
		isSubmitting,
		setSubmitting,
		touched,
		errors,
		setFieldValue,
		handleSubmit,
	} = useFormik({
		initialValues: {
			managerId: '',
			name: '',
			type: 'tofufactory',
			description: '',
			address: '',
		},
		validationSchema: Yup.object().shape({
			managerId: valSchema.id.required('Wajib diisi'),
			name: valSchema.name.required('Wajib diisi'),
			type: Yup.string().required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			description: valSchema.description.required('Wajib diisi'),
		}),
		onSubmit: (values) => {
			alert(JSON.stringify(values));
			axios
				.post(`${API_URL}/companies`, trimAllValues(values))
				.then(({ data }) => {
					setSubmitting(false);
					apiResponseToast(data);
				});
		},
	});

	return (
		<Box>
			<Heading size="lg">Buat Aktivitas</Heading>
			<Text>Buat Aktivitas untuk dashboard suatu pabrik</Text>
			<form
				onSubmit={handleSubmit}
				style={{ marginTop: '1.5em' }}
				className="my-form"
			>
				<VStack mx="auto" spacing="2" maxW="container.sm" mt="4">
					<FormControl
						isInvalid={Boolean(errors.managerId) && touched.managerId}
					>
						<FormLabel>Pilih Manager</FormLabel>
						<SelectManagerInput
							alignSelf="start"
							placeholder="Pilih Manager"
							Icon={IconUserBolt}
							itemName="Manager"
							itemIdKey="userId"
							apiUrl="/search/users?role=manager"
							onChange={(e) => setFieldValue('managerId', e.userId)}
						/>
						<FormErrorMessage>{errors.managerId}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={Boolean(errors.name) && touched.name}>
						<FormLabel>Nama Aktivitas</FormLabel>
						<Input
							id="name"
							name="name"
							placeholder="Misal : Pabrik Bahagia"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={Boolean(errors.type) && touched.type}>
						<FormLabel>Jenis Aktivitas</FormLabel>
						<Select
							id="type"
							name="type"
							onChange={handleChange}
							onBlur={handleBlur}
							bg="white"
						>
							{Object.entries(companyTypeAttr).map(([key, value]) => (
								<option key={key} value={key}>
									{value.name}
								</option>
							))}
						</Select>
						<FormErrorMessage>{errors.type}</FormErrorMessage>
					</FormControl>

					<FormControl
						isInvalid={Boolean(errors.address) && touched.address}
					>
						<FormLabel>Alamat Pabrik</FormLabel>
						<Textarea
							id="address"
							name="address"
							placeholder="Masukkan Alamat Pabrik"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.address}</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(errors.description) && touched.description}
					>
						<FormLabel>Deskripsi</FormLabel>
						<Textarea
							id="description"
							name="description"
							placeholder="Masukkan deskripsi pabrik"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormErrorMessage>{errors.description}</FormErrorMessage>
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
