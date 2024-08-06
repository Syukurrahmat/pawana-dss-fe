import LoadingComponent from '@/components/Loading/LoadingComponent';
import { ButtonViewDashboard } from '@/components/common/ChangeActiveDashButton';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import SectionTitle from '@/components/common/SectionTitle';
import TagWithIcon from '@/components/common/TagWithIcon';
import UserCard from '@/components/managerCard';
import { companyTypeAttr } from '@/constants/enumVariable';
import useUser from '@/hooks/useUser';
import { toFormatedDate } from '@/utils/dateFormating';
import { pageDataFetcher } from '@/utils/fetcher';
import { Box, Button, Container, HStack, Heading, Spacer, Text, } from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconCalendar, IconEdit, IconLock, IconTag, IconTextCaption, IconUserHeart } from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import CompanySubscribedNodesList from './DTCompanySubscribedNodes';
import EditGroupButton from './EditCompany';

export default function DetailCompany() {
	const { id } = useParams();
	const { user, roleIs } = useUser();

	const { data, mutate } = useSWR<CompanyDataPage>(
		`/companies/${id}`,
		pageDataFetcher
	);

	if (!data) return <LoadingComponent />;

	return (
		<Box>
			<HeadingWithIcon Icon={<IconUserHeart />} text="Detail Usaha" />
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
							 
						</HStack>
						{['admin', 'gov'].includes(user.role) && (
							<UserCard mt="3" data={data.manager} label="manager" />
						)}
					</Box>
					<Spacer />
					<ButtonViewDashboard
						alignSelf="start"
						companyId={data.companyId}
					/>
					{roleIs(['admin', 'manager']) && (
						<EditGroupButton
							data={data}
							mutate={mutate}
							colorScheme="blue"
							alignSelf="start"
							leftIcon={<IconEdit size="16" />}
							children={'Sunting Usaha'}
						/>
					)}
				</HStack>

				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi Usaha
				</SectionTitle>
				<Text>{data.description}</Text>
				<CompanySubscribedNodesList data={data} mutate={mutate} />

				{roleIs(['admin', 'manager']) && (
					<>
						<SectionTitle IconEl={IconLock}>Lainnya</SectionTitle>
						<Button colorScheme="red">Hapus Usaha</Button>
					</>
				)}
			</Container>
		</Box>
	);
}
