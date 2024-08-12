import FormMapPicker from '@/components/Form/FormMapPicker';
import RequiredIndicator from '@/components/Form/RequiredIndicator';
import { BigAlert } from '@/components/common/BigAlert';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import { companyTypeAttr } from '@/constants/enumVariable';
import useUser from '@/hooks/useUser';
import { trimAllValues } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import * as valSchema from '@/utils/validator.utils';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Text, Textarea, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconUserBolt } from '@tabler/icons-react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

export default function CreateCompany() {
	const { user, roleIs } = useUser();
	const { role, userId } = user;
	const [managerInfo, setManagerInfo] = useState<any>({});

	const defaultManagerId = role == 'manager' ? userId : NaN;

	const {
		handleChange,
		handleBlur,
		isSubmitting,
		setSubmitting,
		touched,
		errors,
		values,
		setStatus,
		status,
		resetForm,
		setFieldValue,
		handleSubmit,
	} = useFormik({
		initialValues: {
			managerId: defaultManagerId,
			name: '',
			type: 'tofufactory',
			description: '',
			address: '',
			coordinate: [NaN, NaN],
		},
		validationSchema: Yup.object().shape({
			managerId: valSchema.id.required('Wajib diisi'),
			name: valSchema.name.required('Wajib diisi'),
			type: Yup.string().required('Wajib diisi'),
			address: valSchema.address.required('Wajib diisi'),
			description: valSchema.description.required('Wajib diisi'),
			coordinate: valSchema.coordinate.required('Wajib diisi'),
		}),

		onSubmit: (values) => {
			myAxios
				.post('/companies', trimAllValues(values))
				.then(({ data }) => setStatus(data || false))
				.catch(() => setStatus(false))
				.finally(() => setSubmitting(false));
		},
	});

	useEffect(() => {
		if (!defaultManagerId)
			setFieldValue('managerId', managerInfo?.userId as any);
	}, [managerInfo]);

	return (
		<Box>
			<Heading size="lg">Buat Usaha</Heading>
			<Text>Buat Usaha dan dapatkan dukungan keputusan untuk perusahaan Anda</Text>

			<Container maxW="container.sm" mt="6">
				{status !== undefined ? (
					status ? (
						<BigAlert
							status="success"
							title="Usaha berhasil dibuat"
							description="Tambah Node baik indoor maupun outdoor untuk mendapatkan informasi dan rekomendasi seputar kualiats udara dan emisi gas rumah kaca"
							onCreateAgain={resetForm}
							itemName="usaha"
							detailPageURL={`/companies/${status.result.companyId}`}
						/>
					) : (
						<BigAlert
							status="warning"
							title="Usaha gagal didaftarkan"
							description="Ada yang salah. Hubungi Administrator"
							onCreateAgain={resetForm}
						/>
					)
				) : (
					<form onSubmit={handleSubmit} className="my-form">
						<VStack mx="auto" spacing="2">
							{roleIs('admin') && (
								<FormControl
									isInvalid={
										Boolean(errors.managerId) && touched.managerId
									}
								>
									<FormLabel>
										Pilih Manager <RequiredIndicator />
									</FormLabel>
									<SelectFromDataTable
										leftIcon={<IconUserBolt size="30" />}
										itemName="Manager"
										apiUrl="/search/users?role=manager"
										selectValue={managerInfo}
										selectOnChange={setManagerInfo}
										displayRow={(e) => (
											<NameWithAvatar name={e.name} />
										)}
									/>
									<FormErrorMessage>
										{errors.managerId}
									</FormErrorMessage>
								</FormControl>
							)}

							<FormControl
								isInvalid={Boolean(errors.name) && touched.name}
							>
								<FormLabel>
									Nama Usaha <RequiredIndicator />
								</FormLabel>
								<Input
									id="name"
									name="name"
									placeholder="Misal : Pabrik Bahagia"
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<FormErrorMessage>{errors.name}</FormErrorMessage>
							</FormControl>

							<FormControl
								isInvalid={Boolean(errors.type) && touched.type}
							>
								<FormLabel>
									Jenis Usaha <RequiredIndicator />
								</FormLabel>
								<Select
									id="type"
									name="type"
									onChange={handleChange}
									onBlur={handleBlur}
									bg="white"
								>
									{Object.entries(companyTypeAttr).map(
										([key, value]) => (
											<option key={key} value={key}>
												{value.name}
											</option>
										)
									)}
								</Select>
								<FormErrorMessage>{errors.type}</FormErrorMessage>
							</FormControl>

							<FormControl
								isInvalid={Boolean(errors.address) && touched.address}
							>
								<FormLabel>
									Alamat Pabrik <RequiredIndicator />
								</FormLabel>
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
								isInvalid={
									Boolean(errors.description) && touched.description
								}
							>
								<FormLabel>
									Deskripsi <RequiredIndicator />
								</FormLabel>
								<Textarea
									id="description"
									name="description"
									placeholder="Masukkan deskripsi pabrik"
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<FormErrorMessage>
									{errors.description}
								</FormErrorMessage>
							</FormControl>

							<FormMapPicker
								errors={errors.coordinate}
								touched={touched.coordinate}
								values={values.coordinate}
								setFieldValue={setFieldValue}
							/>
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
				)}
			</Container>
		</Box>
	);
}
