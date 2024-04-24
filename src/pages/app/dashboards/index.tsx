import { Flex } from '@chakra-ui/react'; // prettier-ignore
import GroupInfoDash from './grupInfo';
import IspuCard2 from './ispuCard2';

export default function Dashboard() {
	return (
		<Flex
			flexWrap="wrap"
			alignContent="flex-start"
			justify="start"
			gap="6"
			h="4000px"
		>
			<GroupInfoDash />
			<IspuCard2/>
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
		</Flex>
	);
}
