import LoadingComponent from '@/components/Loading/LoadingComponent';
import useUser, { User } from '@/hooks/useUser';
import { pageDataFetcher } from '@/utils/fetcher';
import { Flex, VStack } from '@chakra-ui/react'; // prettier-ignore
import useSWR from 'swr';
import { CurrentEventsCard } from './CurrentEvents';
import DashboardInfo from './DashInfoWithMaps';
import { NearReport } from './NearReport';
import NodesGroupInfo from './NodesGroupInfo';
import { DontHaveCompany, SelectUserOrCompanyView } from './informationCard';

export default function Dashboard() {
	const { user, roleIs, roleIsNot } = useUser();
	const { id, type } = getDahsboardView(user);

	if (type && !id) return <DontHaveCompany role={user.role} />;
	if (!type && roleIs(['admin', 'gov'])) return <SelectUserOrCompanyView />;
	
	const apiUrl =
		id && type
			? `${(type == 'company' ? '/companies/' : '/users/') + id}/dashboard`
			: null;

	const { data, isLoading } = useSWR<DashboardDataType>(
		apiUrl,
		pageDataFetcher
	);

	if (isLoading || !data) return <LoadingComponent />;

	return (
		<VStack spacing="4" align="stretch">
			<DashboardInfo data={data} />
			{data.indoor && <NodesGroupInfo data={data.indoor} type="indoor" />}

			<NodesGroupInfo
				data={data.outdoor}
				type={data.dashboardInfo.type == 'regular' ? 'arround' : 'outdoor'}
			/>

			{roleIsNot('regular') && (
				<Flex w="full" gap="4">
					<CurrentEventsCard flex="1 1 0 " data={data.currentEventLogs} />
					<NearReport flex="1 1 0 " data={data.nearReports} />
				</Flex>
			)}
		</VStack>
	);
}

function getDahsboardView(user: User) {
	const { view } = user;
	const roleView = view?.user?.role;

	const type =
		roleView == 'regular'
			? 'user'
			: roleView == 'manager'
			? 'company'
			: undefined;

	const id =
		type === 'company'
			? view?.company?.companyId
			: type == 'user'
			? view?.user?.userId
			: undefined;

	return { type, id };
}
