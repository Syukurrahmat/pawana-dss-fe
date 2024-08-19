import { SelectUserOrCompanyView } from '@/components/common/AdminInforCard';
import LoadingComponent from '@/components/Loading/LoadingComponent';
import useUser, { User } from '@/hooks/useUser';
import { fetcher } from '@/utils/fetcher';
import { Flex, VStack } from '@chakra-ui/react'; // prettier-ignore
import useSWR from 'swr';
import { CurrentEventsCard } from './CurrentEvents';
import DashboardInfo from './DashInfoWithMaps';
import { NearReport } from './NearReport';
import NodesGroupInfo from './NodesGroupInfo';

export default function Dashboard() {
	const { user, roleIs, roleIsNot } = useUser();
	const { id, type } = getDahsboardView(user);

	if (!type && roleIs(['admin', 'gov']))
		return <SelectUserOrCompanyView selectCompanyOnly={false} />;

	const apiUrl =
		id && type
			? `${type === 'company' ? '/companies/' : '/users/'}${id}/dashboard`
			: null;

	const { data, isLoading } = useSWR<DashboardDataType>(apiUrl, fetcher);

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

	if (view?.company && view.company.companyId) {
		return {
			type: 'company',
			id: view.company.companyId,
		};
	}
	if (view?.user && view.user.userId && view.user.role == 'regular') {
		return {
			type: 'user',
			id: view.user.userId,
		};
	}

	return {
		type: undefined,
		id: undefined,
	};
}
