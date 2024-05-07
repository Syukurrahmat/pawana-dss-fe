import { TagLeftIcon, TagLabel, BoxProps, Box, Container, HStack, Heading, Tag, Text, Button, useDisclosure,} from '@chakra-ui/react'; //prettier-ignore
import {IconUser,  IconAddressBook, IconCircleDot, IconEdit, IconTextCaption, IconUserHeart, IconUserQuestion, IconUsersGroup,} from '@tabler/icons-react'; //prettier-ignore
import { API_URL } from '@/constants/config';
import { fetcher } from '@/utils/index.utils';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditGroupButton from './EditGroup';
import SectionTitle from '@/components/common/sectionTitle';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import ManagerCard from '../../../components/managerCard';
import NodeMapsAndNodesList from './detailGroupTables/NodesList';
import MembersList from './detailGroupTables/MembersList';
import RequestingMembersList from './detailGroupTables/RequestingMembersList';

export default function DetailGroup() {
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

					<EditGroupButton
						data={data}
						mutate={mutate}
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
				<NodeMapsAndNodesList />

				<SectionTitle IconEl={IconUsersGroup}>
					Daftar Pelanggan
					<Tag colorScheme="blue" ml="2">
						{data.membersCount | 0}
					</Tag>
				</SectionTitle>

				<MembersList />

				{!!data.memberRequestsCount && (
					<>
						<SectionTitle IconEl={IconUserQuestion}>
							Permintaan langganan
							<Tag colorScheme="blue" ml="2">
								{data.memberRequestsCount | 0}
							</Tag>
						</SectionTitle>
						<RequestingMembersList />
					</>
				)}
			</Container>
		</>
	);
}

interface IGroupStats extends BoxProps {
	data: detailOfGroupData;
}

function GroupStats({ data, ...rest }: IGroupStats) {
	return (
		<HStack {...rest}>
			<Tag size="md" variant="subtle" colorScheme="green">
				<TagLeftIcon boxSize="16px" as={IconUser} />
				<TagLabel>{data.membersCount | 0} Pelanggan</TagLabel>
			</Tag>
			{Boolean(data.memberRequestsCount) && (
				<Tag size="md" variant="subtle" colorScheme="orange">
					<TagLeftIcon boxSize="16px" as={IconUserQuestion} />
					<TagLabel>{data.memberRequestsCount} Permintaan</TagLabel>
				</Tag>
			)}
			<Tag size="md" variant="subtle" colorScheme="blue">
				<TagLeftIcon boxSize="16px" as={IconCircleDot} />
				<TagLabel>{data.nodeCount | 0} Node</TagLabel>
			</Tag>
		</HStack>
	);
}
