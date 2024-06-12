import RequiredIndicator from '@/components/Form/RequiredIndicator';
import MyMap from '@/components/Maps';
import { BigAlert } from '@/components/common/BigAlert';
import CompanyIcon from '@/components/common/CompanyIcon';
import { MyRadio } from '@/components/common/MyRadio';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import { API_URL, CENTER_OF_MAP } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import { trimAllValues } from '@/utils/common.utils';
import * as valSchema from '@/utils/validator.utils';
import { Box, Button, Container, Divider, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Heading, Icon, Input, RadioGroup, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconInfoCircle, IconLock, IconWorld } from '@tabler/icons-react'; //prettier-ignore
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const publicNodeValidationSchema = Yup.object().shape({
	name: valSchema.name.required('Wajib diisi'),
	description: valSchema.description.required('Wajib diisi'),
	address: valSchema.address.required('Wajib diisi'),
	instalationDate: Yup.date().nullable(),
	coordinate: Yup.array().test(
		'',
		'Anda Belum menentukan titik koordinat',
		(e) => e && e.filter((e) => e).length == 2
	),
});

const privateNodeValidationSchema = Yup.object().shape({
	companyId: Yup.number().required('Wajib diisi'),
	name: valSchema.name.required('Wajib diisi'),
	description: valSchema.description.required('Wajib diisi'),
	instalationDate: Yup.date().nullable(),
});

export default function CreateNode() {
	const { apiResponseToast } = useApiResponseToast();
	const [managerInfo, setManagerInfo] = useState<any>({});
	const [isPrivate, setIsPrivate] = useState(0);
	const navigate = useNavigate();

	const validationSchema = isPrivate
		? privateNodeValidationSchema
		: publicNodeValidationSchema;

	const {
		handleChange,
		handleBlur,
		values,
		touched,
		status,
		setStatus,
		setFieldValue,
		resetForm,
		setSubmitting,
		isSubmitting,
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
			companyId: NaN,
		},
		validationSchema,
		onSubmit: (values) => {
			axios
				.post(`${API_URL}/nodes`, trimAllValues(values))
				.then(({ data }) => setStatus(data || false))
				.catch(() => setStatus(false))
				.finally(() => setSubmitting(false));
		},
	});

	useEffect(() => {
		setFieldValue('companyId', managerInfo.companyId);
	}, [managerInfo]);

	const tabsListInfo = [
		{
			icon: IconWorld,
			name: 'Node Publik',
			note: 'Membuat node Publik yang dapat digunakan oeh semua user',
		},
		{
			icon: IconLock,
			name: 'Node Private',
			note: 'Membuat node private hanya suatu usaha spesifik',
		},
	];

	return (
		<Box>
			<Heading size="lg">Buat Grup</Heading>
			<Text>Buat Grup untuk dashboard suatu pabrik</Text>
			<Container maxW="container.md" mt="4">
				{status === undefined && (
					<Tabs
						index={isPrivate}
						onChange={setIsPrivate}
						variant="soft-rounded"
						colorScheme="blue"
					>
						<TabList gap="4">
							{tabsListInfo.map(({ name, icon }, i) => (
								<Tab rounded="md" key={i}>
									<Icon as={icon} boxSize="20px" />
									<Text ml="2">{name}</Text>
								</Tab>
							))}
						</TabList>
						<Divider mt="2" border="1px solid" borderColor="gray.400" />
						<TabPanels>
							{tabsListInfo.map(({ note }, i) => (
								<TabPanel px="0" as={HStack} key={i} spacing="1">
									<IconInfoCircle size="20" />
									<Text ml="2">{note}</Text>
								</TabPanel>
							))}
						</TabPanels>
					</Tabs>
				)}
				{status !== undefined ? (
					status ? (
						<BigAlert
							status="success"
							title="Node berhasil dibuat"
							description="Node siap untuk digunakan dalam sistem Anda"
							onCreateAgain={resetForm}
							itemName="node"
							detailPageURL={`/nodes/${status?.result.nodeId}`}
						/>
					) : (
						<BigAlert
							status="warning"
							title="Node gagal didaftarkan"
							description="Ada yang salah. Hubungi Administrator"
							onCreateAgain={resetForm}
						/>
					)
				) : (
					<Container maxW="container.sm">
						<form onSubmit={handleSubmit} className="my-form">
							<VStack
								mx="auto"
								spacing="2"
								maxW="container.sm"
								pb="1000px"
							>
								{isPrivate && (
									<FormControl isInvalid={Boolean(errors.companyId)}>
										<FormLabel>
											Pilih Usaha <RequiredIndicator />
										</FormLabel>

										<SelectFromDataTable
											leftIcon={<IconBuildingFactory2 size="30" />}
											itemName="Usaha"
											apiUrl="/search/companies"
											selectValue={managerInfo}
											selectOnChange={setManagerInfo}
											displayRow={(e) => (
												<HStack>
													<CompanyIcon bg="white" type={e.type} />
													<Text
														children={
															e?.name || 'Node yang Anda ikuti'
														}
													/>
												</HStack>
											)}
										/>
										<FormErrorMessage>
											{errors.companyId}
										</FormErrorMessage>
									</FormControl>
								)}
								<FormControl
									isInvalid={Boolean(errors.name) && touched.name}
								>
									<FormLabel>
										Nama Node <RequiredIndicator />
									</FormLabel>
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
									isInvalid={
										Boolean(errors.description) && touched.description
									}
								>
									<FormLabel>
										Deskripsi node <RequiredIndicator />
									</FormLabel>
									<Textarea
										id="description"
										name="description"
										placeholder="Masukkan deskripsi node, singkat saja"
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<FormErrorMessage>
										{errors.description}
									</FormErrorMessage>
								</FormControl>

								{!isPrivate && (
									<>
										<FormControl
											isInvalid={
												Boolean(errors.address) && touched.address
											}
										>
											<FormLabel>
												Alamat node <RequiredIndicator />
											</FormLabel>
											<Textarea
												id="address"
												name="address"
												placeholder="Masukkan Alamat Node berada"
												onChange={handleChange}
												onBlur={handleBlur}
											/>
											<FormErrorMessage>
												{errors.address}
											</FormErrorMessage>
										</FormControl>
									</>
								)}

								<FormControl>
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

								<FormControl>
									<FormLabel>
										Status Node <RequiredIndicator />
									</FormLabel>
									<RadioGroup
										onChange={(e) => setFieldValue('status', e)}
										value={values.status}
									>
										<HStack spacing={4}>
											<MyRadio value="active">Aktifkan</MyRadio>
											<MyRadio value="nonactive">
												Nonaktifkan
											</MyRadio>
										</HStack>
									</RadioGroup>
								</FormControl>

								{!isPrivate && (
									<>
										<FormControl
											isInvalid={
												Boolean(errors.coordinate) &&
												touched.coordinate
											}
										>
											<FormLabel>
												Koordinat Node <RequiredIndicator />
											</FormLabel>
											<FormHelperText>
												Geser peta dan paskan penanda ke titik yang
												dimaksud
											</FormHelperText>
											<MyMap
												mt="3"
												data={[]}
												outline={
													errors.coordinate && touched.coordinate
														? '2px solid'
														: ''
												}
												outlineColor="#E53E3E"
												isEditing={{
													coordinate: CENTER_OF_MAP,
													onChange: (x) =>
														setFieldValue('coordinate', [
															x.lat,
															x.lng,
														]),
												}}
											/>

											<FormErrorMessage>
												{errors.coordinate}
											</FormErrorMessage>
										</FormControl>
									</>
								)}
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
					</Container>
				)}
			</Container>
		</Box>
	);
}
