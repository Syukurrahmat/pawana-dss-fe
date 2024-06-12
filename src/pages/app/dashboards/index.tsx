import { Flex, VStack } from '@chakra-ui/react'; // prettier-ignore
import useSWR from 'swr';
import { pageDataFetcher } from '@/utils/fetcher';
import DashboardInfo from './DashboardInfo';
import NodesGroupInfo from './NodesGroupInfo';
import LoadingComponent from '@/components/Loading/LoadingComponent';
import { CurrentEventsCard } from './CurrentEvents';
import { NearReport } from './NearReport';

export default function Dashboard() {
	const { data, isLoading } = useSWR<DashboardDataType>(
		'/dashboard',
		pageDataFetcher
	);

	if (isLoading || !data) return <LoadingComponent />;

	return (
		<VStack spacing="4" align="stretch" h="4000px">
			<DashboardInfo data={data} />
			
			{data.indoor && <NodesGroupInfo data={data.indoor} type="indoor" />}
			
			<NodesGroupInfo
				data={data.outdoor}
				type={data.dashboardInfo.type == 'regular' ? 'arround' : 'outdoor'}
			/>

			{!!data.currentEventLogs && (
				<Flex w="full" gap="4">
					<>
						<CurrentEventsCard
							flex="1 1 0 "
							data={data.currentEventLogs}
						/>
						<NearReport
							flex="1 1 0 "
							data={data.nearReports}
						/>
					</>
				</Flex>
			)}
		</VStack>
	);
}
