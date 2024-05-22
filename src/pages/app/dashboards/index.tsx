import { VStack } from '@chakra-ui/react'; // prettier-ignore
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { HOST_URL } from '@/constants/config';
import CompanyInformation from './CompanyInfo';
import NodesGroupInfo from './NodesGroupInfo';


export default function Dashboard() {
	const { data, isLoading, error } = useSWR<DashboardDataType>(
		HOST_URL + '/app/dashboard/data',
		fetcher
	);

	if (isLoading || !data) return 'Loading Slurr';

	return (
		<VStack spacing="6" align="stretch" h="4000px">
			<CompanyInformation data={data} />
			<NodesGroupInfo data={data.indoor}/>
			<NodesGroupInfo data={data.outdoor}/>
			{/* <ISPUCard data={data}/> */}

			{/* <Flex flexWrap="wrap" w="full" gap="6">
				<GRKCard />
				<GRKCard />
				<ClimateCard />
			</Flex>
			<Flex w="full" gap="6">
				<ISPUCard />
				<ISPUCard />
			</Flex>
			<Flex>
				<ActivityCard />
			</Flex> */}
		</VStack>
	);
}
 