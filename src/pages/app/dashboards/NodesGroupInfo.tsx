import { Alert, AlertTitle, AlertDescription, Box,Card, CardBody, Stack, StackDivider, VStack, Icon } from '@chakra-ui/react'; // prettier-ignore
import SingleNodeISPU from './ISPU/SingleNodeISPU';
import MultiNodeISPU from './ISPU/MultiNodeISPU';
import { IconReceipt } from '@tabler/icons-react';
import SingleNodeGRK from './GRK/SingleNodeGRK';
import MultiNodeGRK from './GRK/MultiNodeGRK';

interface ISPUCard {
	data: DataNodeGroup;
}

export default function NodesGroupInfo({
	data: { data, countNodes },
}: ISPUCard) {
	return (
		<Card>
			<CardBody>
				{!!countNodes.active && (
					<>
						<Stack
							divider={<StackDivider borderColor="gray.200" />}
							direction="row"
							spacing="5"
						>
							{/* ISPU  */}
							<VStack flex="1 1 0px" align="start" spacing="4">
								{countNodes.active == 1 ? (
									<SingleNodeISPU
										data={
											data?.ispu as SingleNodeAnalysisItem<
												ISPUValue[],
												ISPUValue[]
											>
										}
									/>
								) : (
									<MultiNodeISPU
										data={data?.ispu as NodeStat<ISPUValue[]>}
									/>
								)}
							</VStack>

							{/* GRK  */}

							<VStack flex="1 1 0px" align="start" spacing="4">
								{countNodes.active == 1 ? (
									<SingleNodeGRK
										CO2data={
											data?.co2 as SingleNodeAnalysisItem<
												GRKCategorize,
												number
											>
										}
										CH4data={
											data?.ch4 as SingleNodeAnalysisItem<
												GRKCategorize,
												number
											>
										}
									/>
								) : (
									<MultiNodeGRK
										CH4data={data?.ch4 as NodeStat<GRKCategorize>}
										CO2data={data?.co2 as NodeStat<GRKCategorize>}
									/>
								)}
							</VStack>
						</Stack>

						<Alert
							mt="6"
							status="info"
							variant="left-accent"
							rounded="md"
							alignItems="start"
						>
							<Icon
								as={IconReceipt}
								boxSize="7"
								color="blue.600"
								mt="1"
							/>

							<Box ml="3">
								<AlertTitle>Your browser is outdated!</AlertTitle>
								<AlertDescription>
									Your Chakra experience may be degraded.
								</AlertDescription>
							</Box>
						</Alert>
					</>
				)}
			</CardBody>
		</Card>
	);
}
