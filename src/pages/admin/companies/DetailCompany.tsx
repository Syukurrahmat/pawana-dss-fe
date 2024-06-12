import { IconAddressBook, IconCircleDot, IconEdit, IconTextCaption, IconUserHeart, IconCalendar, IconTag, IconChartBar,} from '@tabler/icons-react'; //prettier-ignore
import { Box, Button, Container, HStack, Heading, Spacer, Text,} from '@chakra-ui/react'; //prettier-ignore
import { toFormatedDate } from '@/utils/dateFormating';
import { companyTypeAttr } from '@/constants/enumVariable';
import { useParams } from 'react-router-dom';
import { pageDataFetcher } from '@/utils/fetcher';
import SectionTitle from '@/components/common/SectionTitle';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import TagWithIcon from '@/components/common/TagWithIcon';
import EditGroupButton from './EditCompany';
import UserCard from '@/components/managerCard';
import useSWR from 'swr';
import LoadingComponent from '@/components/Loading/LoadingComponent';
import CompanySubscribedNodesList from './DTCompanySubscribedNodes';
import useUser from '@/hooks/useUser';

export default function DetailCompany() {
	useUser();
	const { id } = useParams();
	const { data, mutate } = useSWR<CompanyDataPage>(
		`/companies/${id}`,
		pageDataFetcher
	);

	if (!data) return <LoadingComponent />;

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
							<TagWithIcon
								icon={IconCircleDot}
								children={data.countSubscribedNodes + ' Node'}
							/>
						</HStack>

						<UserCard mt="3" data={data.manager} label="manager" />
					</Box>
					<Spacer />
					<Button
						colorScheme="green"
						leftIcon={<IconChartBar size="16" />}
						alignSelf="start"
						children="Dashboard"
					/>

					<EditGroupButton
						data={data}
						mutate={mutate}
						colorScheme="blue"
						alignSelf="start"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Usaha'}
					/>
				</HStack>

				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi Usaha
				</SectionTitle>
				<Text>{data.description}</Text>

				<CompanySubscribedNodesList data={data} mutate={mutate} />
			</Container>
		</Box>
	);
}
