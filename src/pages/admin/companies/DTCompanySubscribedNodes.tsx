import { Spacer,Heading,  HStack, Button, Text, Icon, VStack, Box} from '@chakra-ui/react'; //prettier-ignore
import { IconMapCancel, IconCirclePlus, IconEdit, IconDeviceFloppy, IconUsersGroup, IconBuilding, IconTrees} from '@tabler/icons-react'; //prettier-ignore
import { KeyedMutator, mutate } from 'swr';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import {
	getPrivateNodesColumns,
	getSubscribedNodesColumns,
} from '@/components/DataTable/commonColumn';
import { useMemo, useState } from 'react';
import { API_URL } from '@/constants/config';
import DataTable from '@/components/DataTable';
import SectionTitle from '@/components/common/SectionTitle';
import axios from 'axios';
import MyMap from '@/components/Maps';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import GMapsButton from '@/components/common/GMapsButton';
import { AddNodeCompanySubscription } from '@/components/common/AddNodeSubscription';
import { useNavigate } from 'react-router-dom';

interface CompSubscribedNodes {
	data: CompanyDataPage;
	mutate: KeyedMutator<any>;
}

export default function CompanySubscribedNodesList(props: CompSubscribedNodes) {
	const { data, mutate: dataPageMutate } = props;

	const navigate = useNavigate()
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);
	const { apiResponseToast } = useApiResponseToast();
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedCoordinate, setEditedCoordinate] = useState(data.coordinate);

	const confirmDialog = useConfirmDialog();

	const { companyId } = data;
	const dtNodeSubsApiURL = `/companies/${companyId}/nodes`;
	const dtNodePrivateApiURL = `/companies/${companyId}/private-nodes`;

	const handleRemoveUserSubscription = (subscriptionid: number) => {
		const deleteURL = `${API_URL + dtNodeSubsApiURL}?subscriptionid=${subscriptionid}`; //prettier-ignore

		confirmDialog({
			title: 'Hapus Pengikuti Node',
			message: 'Anda yakin hendak menghapus node ini dari daftar langganan',
			confirmButtonColor: 'red',
			onConfirm: () =>
				axios.delete(deleteURL).then(({ data: dt }) => {
					mutate((e: any) => e && e[0] == dtNodeSubsApiURL);
					dataPageMutate();
					apiResponseToast(dt);
				}),
		});
	};

	const handleSubmitEditedCoordinate = async () => {
		const submitNewCoordinateURL = `${API_URL}/companies/${companyId}`;

		setIsSubmiting(true);
		const { data: dt } = await axios.put(submitNewCoordinateURL, {
			coordinate: editedCoordinate,
		});

		setIsSubmiting(false);
		apiResponseToast(dt, {
			onSuccess() {
				setIsEditing(false);
				dataPageMutate({ ...data, coordinate: editedCoordinate });
			},
		});
	};

	const nodeSubscriptionColumns = useMemo(
		() => getSubscribedNodesColumns(handleRemoveUserSubscription),
		[]
	);

	const nodePrivateColumns = useMemo(() => getPrivateNodesColumns(), []);

	return (
		<>
			<SectionTitle IconEl={IconUsersGroup}>
				Lokasi Usaha dan Node yang dikuti
			</SectionTitle>
			<HStack>
				{!isEditing && (
					<>
						<GMapsButton size="md" coordinate={data.coordinate}>
							Buka lokasi Usaha di Gmaps
						</GMapsButton>
						<Spacer />
						<Button
							colorScheme="yellow"
							leftIcon={<IconEdit size="18" />}
							children="Sunting lokasi usaha"
							onClick={() => setIsEditing(true)}
						/>
					</>
				)}
				{isEditing && (
					<>
						<Text fontSize="sm">
							Geser peta dan paskan penanda ke titik yang dimaksud
						</Text>
						<Spacer />
						<Button
							colorScheme="red"
							leftIcon={<IconMapCancel size="18" />}
							children="Batal"
							onClick={() => setIsEditing(false)}
							isDisabled={isSubmiting}
						/>
						<Button
							colorScheme="blue"
							leftIcon={<IconDeviceFloppy size="18" />}
							children="Simpan"
							isLoading={isSubmiting}
							onClick={handleSubmitEditedCoordinate}
						/>
					</>
				)}
			</HStack>

			<VStack align="start" spacing="6">
				<MyMap
					w="full"
					my="4"
					h="300px"
					companiesData={nodesDataCtx ? [data] : []}
					data={nodesDataCtx || []}
					outline={isEditing ? '3px solid' : ''}
					outlineColor="orange.300"
					isEditing={
						!isEditing
							? undefined
							: {
									coordinate: data.coordinate,
									onChange: (x) => setEditedCoordinate([x.lat, x.lng]),
							  }
					}
				/>
				<HStack justify="space-between" align="start" w="full">
					<Box>
						<HStack>
							<Icon as={IconBuilding} boxSize="20px" />
							<Heading size="md" fontWeight="600">
								Node Indoor
							</Heading>
						</HStack>
						<Text>
							Daftar sensor yang terdapat di dalam ruangan usaha Anda
						</Text>
					</Box>
					<Button
						leftIcon={<IconCirclePlus size="18" />}
						colorScheme="blue"
						children="Tambah Node Indoor"
						onClick={()=>navigate('/nodes/create')}
					/>
				</HStack>
				<DataTable
					apiUrl={dtNodePrivateApiURL}
					columns={nodePrivateColumns}
					emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
					hiddenPagination={true}
				/>

				<HStack justify="space-between" align="start" w="full">
					<Box>
						<HStack>
							<Icon as={IconTrees} boxSize="20px" />
							<Heading size="md" fontWeight="600">
								Node Outdoor
							</Heading>
						</HStack>
						<Text>Daftar sensor luar ruangan yang Anda ikuti</Text>
					</Box>
				 
					<Button
						leftIcon={<IconCirclePlus size="18" />}
						colorScheme="blue"
						children="Tambah Node outdoor"
						as={AddNodeCompanySubscription}
						companyData={data}
						cursor='pointer'
					/>
				</HStack>

				<DataTable
					apiUrl={dtNodeSubsApiURL}
					columns={nodeSubscriptionColumns}
					setDataContext={setNodeDataCtx}
					emptyMsg={['Belum ada Node', 'Tambahkan Node sekarang']}
					hiddenPagination={true}
				/>
			</VStack>
		</>
	);
}
