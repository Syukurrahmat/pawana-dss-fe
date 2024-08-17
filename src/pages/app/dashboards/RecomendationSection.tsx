import { Alert, AlertTitle, Grid, HStack, Icon, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconBulb } from '@tabler/icons-react'; // prettier-ignore
import { MutiGRK, MutiISPU, NodeGroupType, SingleGRK, SingleISPU } from './NodesGroupInfo'; // prettier-ignore

interface RecomendationSection {
	type: NodeGroupType;
	isSingleNode: boolean;
	data: SingleNodeAnalysis | ResultOfMultiNodeStats;
}

export default function RecomendationSection({
	data,
	type,
	isSingleNode,
}: RecomendationSection) {
	const recomendationIspu = isSingleNode
		? (data.ispu as SingleISPU)?.latestData.value?.[0].recomendation
		: (data.ispu as MutiISPU)?.average.data.value?.[0].recomendation;

	const recomendationCH4 = isSingleNode
		? (data.ch4 as SingleGRK).latestData.value.recomendation
		: (data.ch4 as MutiGRK).average.data.value.recomendation;

	const recomendationCO2 = isSingleNode
		? (data.co2 as SingleGRK).latestData.value.recomendation
		: (data.co2 as MutiGRK).average.data.value.recomendation;

	const contents = [
		{ label: 'Kualitas Udara', recomendation: recomendationIspu },
		{ label: 'Emisi Karbondioksida', recomendation: recomendationCO2 },
		{ label: 'Emisi Metana', recomendation: recomendationCH4 },
	].filter((e) => e.recomendation);

	return (
		<Alert
			mt="6"
			status="info"
			variant="left-accent"
			rounded="sm"
			bg="blue.50"
			alignItems="start"
		>
			<Icon as={IconBulb} boxSize="7" color="blue.600" mt="1" />

			<Tabs ml="3" variant="soft-rounded" colorScheme="blue">
				<TabList as={HStack}>
					<AlertTitle fontWeight="600">Rekomendasi</AlertTitle>
					<Spacer />
					{contents.map((e, i) => (
						<Tab rounded="lg" py="1" key={i}>
							{e.label}
						</Tab>
					))}
				</TabList>

				<TabPanels pb="2">
					{contents.map(({ recomendation }, i) => (
						<TabPanel px="0" py="2" key={i} as={VStack} align="start">
							<Grid
								gap="6"
								templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
							>
								<Text
									textIndent="2em"
									fontSize="md"
									textAlign="justify"
								>
									{recomendation?.info}
								</Text>
								<Text fontSize="md" textAlign="justify">
									<Text fontWeight="600" as="span">
										Saran :{' '}
									</Text>
									{type == 'indoor'
										? recomendation?.company
										: recomendation?.public}
								</Text>
							</Grid>
						</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</Alert>
	);
}
