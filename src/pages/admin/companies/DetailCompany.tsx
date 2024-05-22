import { IconAddressBook, IconCircleDot, IconEdit, IconTextCaption, IconUserHeart, IconCalendar, IconTag,} from '@tabler/icons-react'; //prettier-ignore
import { Box, Container, HStack, Heading, Tag, Text,} from '@chakra-ui/react'; //prettier-ignore
import { toFormatedDate } from '@/utils/dateFormating';
import { companyTypeAttr } from '@/constants/enumVariable';
import { useParams } from 'react-router-dom';
import { pageDataFetcher } from '@/utils/fetcher';
import SectionTitle from '@/components/common/SectionTitle';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import TagWithIcon from '@/components/common/TagWithIcon';
import EditGroupButton from './EditCompany';
import UserCard from '../../../components/managerCard';
import NodeMapsAndNodesList from './DTNodesList';
import useSWR from 'swr';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';

export default function DetailCompany() {
	const { id } = useParams();
	const { data, mutate } = useSWR<CompanyDataPage>(
		`/companies/${id}`,
		pageDataFetcher
	);

	if (!data) return <LoadingAnimation />;

	return (
		<Box>
			<HeadingWithIcon Icon={<IconUserHeart />} text="Detail Grup" />
			<Container mt="8" maxW="container.md">
				<HStack justify="space-between">
					<Box>
						<Heading fontSize="3xl" children={data.name} />
						<HStack mt="2">
							<TagWithIcon
								icon={IconCalendar}
								colorScheme="blue"
								children={`Dibuat pada ${toFormatedDate(
									data.createdAt
								)}`}
							/>
							<TagWithIcon
								icon={IconTag}
								colorScheme={companyTypeAttr[data.type].color}
								textTransform="capitalize"
								children={data.type}
							/>
							<TagWithIcon icon={IconCircleDot} children={'2 Node'} />
						</HStack>

						<UserCard mt="3" data={data.manager} label="manager" />
					</Box>

					<EditGroupButton
						data={data}
						mutate={mutate}
						colorScheme="blue"
						alignSelf="start"
						size="md"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Aktivitas'}
					/>
				</HStack>

				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi Aktivitas
				</SectionTitle>
				<Text>{data.description}</Text>

				<SectionTitle IconEl={IconCircleDot}>
					Daftar Node
					<Tag colorScheme="blue" ml="2"></Tag>
				</SectionTitle>
				<NodeMapsAndNodesList companyCoord={data.coordinate} />
			</Container>
		</Box>
	);
}
