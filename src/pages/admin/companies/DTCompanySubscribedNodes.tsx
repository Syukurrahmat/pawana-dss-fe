import DataTable from '@/components/DataTable';
import {
	getPrivateNodesColumns,
	getSubscribedNodesColumns,
} from '@/components/DataTable/commonColumn';
import EditInMapInputGroup from '@/components/Form/EditInMapInputGroup';
import MyMap from '@/components/Maps';
import NodeSubscription from '@/components/common/AddNodeSubscription';
import SectionTitle from '@/components/common/SectionTitle';
import { API_URL } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import useUser from '@/hooks/useUser';
import { Box, Button, HStack, Heading, Icon, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconBuilding, IconCirclePlus, IconTrees, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import axios from 'axios';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyedMutator, mutate } from 'swr';

interface CompSubscribedNodes {
	data: CompanyDataPage;
	mutate: KeyedMutator<CompanyDataPage>;
}

export default function CompanySubscribedNodesList(props: CompSubscribedNodes) {
	const { data, mutate: dataPageMutate } = props;

	const navigate = useNavigate();
	const [nodesDataCtx, setNodeDataCtx] = useState<null | any[]>(null);
	const { apiResponseToast } = useApiResponseToast();
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedCoordinate, setEditedCoordinate] = useState(data.coordinate);
	const { user, roleIs } = useUser();
	const confirmDialog = useConfirmDialog();

	const { companyId } = data;
	const dtNodeSubsApiURL = `/companies/${companyId}/nodes`;
	const dtNodePrivateApiURL = `/companies/${companyId}/private-nodes`;

	const handleRemoveNodeSubscription = (subscriptionid: number) => {
		const deleteURL = `${API_URL + dtNodeSubsApiURL}?subscriptionid=${subscriptionid}`; //prettier-ignore

		confirmDialog({
			title: 'Hapus Pengikuti Node',
			message: 'Anda yakin hendak menghapus node ini dari daftar langganan',
			confirmButtonColor: 'red',
			onConfirm: () =>
				axios.delete(deleteURL).then(({ data: dt }) => {
					mutate((e: any) => e && e[0] == dtNodeSubsApiURL);
					dataPageMutate((e) => {
						e!.countSubscribedNodes -= 1;
						return e;
					});
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
		() => getSubscribedNodesColumns(user.role, handleRemoveNodeSubscription),
		[]
	);

	const nodePrivateColumns = useMemo(() => getPrivateNodesColumns(), []);

	return (
		<>
			<SectionTitle IconEl={IconUsersGroup}>
				Lokasi Usaha dan Node yang dikuti
			</SectionTitle>

			<Box>
				<EditInMapInputGroup
					role={user.role}
					coordinate={data.coordinate}
					isEditingState={[isEditing, setIsEditing]}
					editedCoordinateState={[editedCoordinate, setEditedCoordinate]}
					isSubmiting={isSubmiting}
					handleSubmitEditedCoordinate={handleSubmitEditedCoordinate}
				/>
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
									coordinate: editedCoordinate || data.coordinate,
									onChange: (x) => setEditedCoordinate([x.lat, x.lng]),
							  }
					}
				/>
			</Box>

			<VStack align="start" spacing="6">
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
					{roleIs(['admin', 'manager']) && (
						<Button
							leftIcon={<IconCirclePlus size="18" />}
							colorScheme="blue"
							children="Tambah Node Indoor"
							onClick={() =>
								navigate('./create-node', {
									state: {
										company: {
											name: data.name,
											companyId: data.companyId,
											type: data.type,
										},
									},
								})
							}
						/>
					)}
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

					{roleIs(['admin', 'manager']) && (
						<NodeSubscription
							subsInfo={{
								type: 'company',
								companyData: data,
							}}
						>
							<Button
								leftIcon={<IconCirclePlus size="18" />}
								colorScheme="blue"
								children="Tambah Node outdoor"
							/>
						</NodeSubscription>
					)}
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
