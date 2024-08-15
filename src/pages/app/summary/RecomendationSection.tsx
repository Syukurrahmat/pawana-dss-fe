import { Box, Divider, Grid, HStack, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import RecomendationCard from './RecomendationCard';
import {
	IconBuildingFactory,
	IconBuildingFactory2,
	IconTrees,
} from '@tabler/icons-react';

interface AverageSection {
	indoor?: SummaryAverageInsight;
	outdoor?: SummaryAverageInsight;
}

export function ISPURecomendationSection({ indoor, outdoor }: AverageSection) {
	const list = [
		{
			key: 'indoor',
			label: 'Untuk lingkup perusahaan',
			data: indoor?.ispu?.[0].recomendation,
		},
		{
			key: 'outdoor',
			label: 'Untuk kondisi diluar perusahaan',
			data: outdoor?.ispu?.[0].recomendation,
		},
	];

	if (!list.filter((e) => e.data).length) return null;

	return (
		<RecomendationCard>
			<Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={8}>
				{list
					.filter((e) => e.data)
					.map(({ label, key, data: recomendation }) => (
						<Box key={key} as={VStack} align="start">
							<HStack
								px="3"
								py="1.5"
								rounded="md"
								border="1px solid"
								borderColor="blue.200"
							>
								<Icon
									as={
										key == 'indoor' ? IconBuildingFactory2 : IconTrees
									}
									boxSize="18px"
								/>
								<Text fontSize="md" fontWeight="600">
									{label}
								</Text>
							</HStack>
							<Text textAlign="justify">{recomendation?.info}</Text>
							<Text textAlign="justify">
								<Text as="span" fontWeight={600}>
									Saran :{' '}
								</Text>
								{key == 'indoor'
									? recomendation?.company
									: recomendation?.public}
							</Text>
						</Box>
					))}
			</Grid>
		</RecomendationCard>
	);
}

export function GRKRecomendationSection({ indoor, outdoor }: AverageSection) {
	const list = [
		{ key: 'co2', label: 'Karbon dioksida' },
		{ key: 'ch4', label: 'Metana' },
	]
		.map((e) => ({
			...e,
			data: [
				{
					key: 'indoor',
					label: 'Untuk lingkup perusahaan',
					// @ts-ignore
					recomendation: indoor?.[e.key]?.recomendation,
				},
				{
					key: 'outdoor',
					label: 'Untuk kondisi di luar perusahaan',
					// @ts-ignore
					recomendation: outdoor?.[e.key]?.recomendation,
				},
			],
		}))
		.filter((e) => e.data.filter((f) => f.recomendation).length);

	if (!list.length) return null;

	return (
		<RecomendationCard>
			<Tabs variant="soft-rounded" colorScheme="gray">
				<TabList as={HStack}>
					{list.map((e, i) => (
						<Tab rounded="lg" py="1" key={i}>
							{e.label}
						</Tab>
					))}
				</TabList>
				<Divider my="2" borderColor="gray.300" />

				<TabPanels pb="2">
					{list.map(({ key, data }) => (
						<TabPanel px="0" py="1" key={key} as={VStack} align="start">
							<Grid
								templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
								gap={6}
							>
								{data
									.filter((e) => e.recomendation)
									.map(({ label, recomendation }, i) => (
										<Box key={i} as={VStack} align="start">
											<HStack
												px="3"
												py="1.5"
												rounded="md"
												border="1px solid"
												borderColor="blue.200"
											>
												<Icon
													as={
														key == 'indoor'
															? IconBuildingFactory2
															: IconTrees
													}
													boxSize="18px"
												/>
												<Text fontSize="md" fontWeight="600">
													{label}
												</Text>
											</HStack>

											<Text fontSize="md" textAlign="justify">
												{recomendation?.info}
											</Text>
											<Text fontSize="md" textAlign="justify">
												<span
													style={{
														fontWeight: 600,
													}}
												>
													Saran :{' '}
												</span>
												{key == 'indoor'
													? recomendation?.company
													: recomendation?.public}
											</Text>
										</Box>
									))}
							</Grid>
						</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</RecomendationCard>
	);
}
