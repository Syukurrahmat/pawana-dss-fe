import FormMapPicker from '@/components/Form/FormMapPicker';
import RequiredIndicator from '@/components/Form/RequiredIndicator';
import { BigAlert } from '@/components/common/BigAlert';
import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import { companyTypeAttr } from '@/constants/enumVariable';
import useUser from '@/hooks/useUser';
import { trimAllValues } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import * as valSchema from '@/utils/validator.utils';
import { Box, Button, Container, Divider, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Icon, Input, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Textarea, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconInfoCircle, IconLock, IconWorld } from '@tabler/icons-react'; //prettier-ignore
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useMatch } from 'react-router-dom';
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
	const { roleIs } = useUser();
	const location = useLocation();

	const isOnSpesificNode = !useMatch('/nodes/create');
	const showChooseOwnshipNode = !isOnSpesificNode && roleIs('admin');

	const [managerInfo, setManagerInfo] = useState<any>({});
	const [isPrivate, setIsPrivate] = useState(showChooseOwnshipNode ? 0 : 1);

	const currentCompany = location.state?.company;

	if (isOnSpesificNode && !currentCompany) {
		return <Navigate to=".." relative="path" />;
	}

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
			instalationDate: '',
			coordinate: [NaN, NaN],
			companyId: currentCompany?.companyId || NaN,
		},
		validationSchema,
		onSubmit: (values) => {
			myAxios
				.post(`/nodes`, trimAllValues(values))
				.then(({ data }) => setStatus(data || false))
				.catch(() => setStatus(false))
				.finally(() => setSubmitting(false));
		},
	});

	useEffect(() => {
		setFieldValue('companyId', managerInfo?.companyId);
	}, [managerInfo]);

	useEffect(() => {
		setFieldValue('companyId', currentCompany?.companyId || NaN);
	}, []);

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
			<Heading size="lg">Buat Sensor</Heading>
			<Text>Buat sensor untuk menambah akurasi sistem</Text>
			<Container maxW="container.md" mt="4">
				{status === undefined && showChooseOwnshipNode && (
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
							<VStack mx="auto" spacing="2" maxW="container.sm">
								{isPrivate &&
									(!currentCompany ? (
										<FormControl>
											<FormLabel>
												Pilih Usaha <RequiredIndicator />
											</FormLabel>

											<SelectFromDataTable
												leftIcon={
													<IconBuildingFactory2 size="30" />
												}
												itemName="Usaha"
												apiUrl="/search/companies"
												selectValue={managerInfo}
												selectOnChange={setManagerInfo}
												displayRow={(e) => (
													<HStack>
														<CompanyIcon
															bg="white"
															type={e.type}
														/>
														<Text
															children={
																e?.name ||
																'Node yang Anda ikuti'
															}
														/>
													</HStack>
												)}
											/>
											<FormErrorMessage>
												{errors.companyId as string}
											</FormErrorMessage>
										</FormControl>
									) : (
										<Box alignSelf="start">
											<Text fontWeight="600">
												Buat Node Untuk Usaha
											</Text>
											<HStack
												mt="2"
												spacing="3"
												shadow="xs"
												p="3"
												bg="white"
												rounded="md"
											>
												<CompanyIcon
													type={currentCompany.type}
													size="24px"
												/>
												<Box>
													<Text fontWeight="600" pr="2">
														{currentCompany.name}
													</Text>
													<Text>
														{
															companyTypeAttr[
																currentCompany.type
															].name
														}
													</Text>
												</Box>
											</HStack>
										</Box>
									))}
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

								{!isPrivate && (
									<FormMapPicker
										errors={errors.coordinate}
										touched={touched.coordinate}
										values={values.coordinate}
										setFieldValue={setFieldValue}
									/>
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
