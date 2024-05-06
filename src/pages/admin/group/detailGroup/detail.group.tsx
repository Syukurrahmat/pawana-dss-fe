import { API_URL } from '@/constants/config';
import { fetcher } from '@/utils/index.utils';
import { Box, Container, HStack, Heading, Tag, Text, Button, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton,} from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconCircleDot, IconEdit, IconTextCaption, IconUserHeart, IconUserQuestion, IconUsersGroup,} from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditGroupModal from '../editModal.group';
import SectionTitle from '@/components/common/sectionTitle';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import ManagerCard from './managerCard';
import GroupStats from './groupStats';
import NodeMapsAndNodesTable from './datatables/nodesDetail';
import MembersDetail from './datatables/membersDetail';
import RequestMembersDetail from './datatables/requestMembersDetail';

export default function DetailGroup() {
	const {
		isOpen: editGroupIsOpen,
		onOpen: editGroupOnOpen,
		onClose: editGroupOnClose,
	} = useDisclosure();

	const { id } = useParams();

	const { data: rawData, isLoading, error, mutate } = useSWR(API_URL + '/groups/' + id, fetcher); //prettier-ignore
	const data: detailOfGroupData = rawData?.result;

	if (!data) return '';

	return (
		<>
			<HeadingWithIcon Icon={<IconUserHeart />} text="Detail Grup" />
			<Container mt="8" maxW="container.md">
				<HStack justify="space-between">
					<Box>
						<Heading fontSize="3xl" children={data.name} />
						<GroupStats mt="2" data={data} />

						<ManagerCard mt="3" data={data} />
					</Box>

					<Button
						onClick={editGroupOnOpen}
						
						colorScheme="blue"
						alignSelf="start"
						size="md"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Grup'}
					/>
				</HStack>

				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi Pabrik
				</SectionTitle>
				<Text>{data.description}</Text>

				<SectionTitle IconEl={IconCircleDot}>
					Daftar Node
					<Tag colorScheme="blue" ml="2">
						{data.nodeCount | 0}
					</Tag>
				</SectionTitle>
				<NodeMapsAndNodesTable />

				<SectionTitle IconEl={IconUsersGroup}>
					Daftar Pelanggan
					<Tag colorScheme="blue" ml="2">
						{data.membersCount | 0}
					</Tag>
				</SectionTitle>

				<MembersDetail />

				{!!data.memberRequestsCount && (
					<>
						<SectionTitle IconEl={IconUserQuestion}>
							Permintaan langganan
							<Tag colorScheme="blue" ml="2">
								{data.memberRequestsCount | 0}
							</Tag>
						</SectionTitle>
						<RequestMembersDetail />
					</>
				)}
			</Container>

			<EditGroupModal
				mutate={mutate}
				data={data}
				onClose={editGroupOnClose}
				isOpen={editGroupIsOpen}
			/>
		</>
	);
}
