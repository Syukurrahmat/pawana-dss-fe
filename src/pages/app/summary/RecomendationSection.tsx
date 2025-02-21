import { Box, Divider, Grid, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, TagLeftIcon, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconTrees } from '@tabler/icons-react';
import RecomendationCard from './RecomendationCard';

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
						<RecomendationContent
							key={key}
							type={key}
							label={label}
							recomendation={recomendation!}
						/>
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
				<Divider my="3" borderColor="gray.200" />

				<TabPanels pb="2">
					{list.map(({ key, data }) => (
						<TabPanel   px="0" py="1" key={key} as={VStack} align="start">
							<Grid
								templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
								gap={6}
							>
								{data
									.filter((e) => e.recomendation)
									.map(({ label, recomendation, key }) => (
										<RecomendationContent
											key={key}
											type={key}
											label={label}
											recomendation={recomendation}
										/>
									))}
							</Grid>
						</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</RecomendationCard>
	);
}

interface RecomendationContent {
	type: 'indoor' | 'outdoor' | string;
	label: string;
	recomendation: Recomendation;
}

function RecomendationContent({
	type,
	label,
	recomendation,
}: RecomendationContent) {
	return (
		<Box as={VStack} align="start" >
			<Tag
				colorScheme={type == 'indoor' ? 'blue' : 'green'}
				size="lg"
				p="3"
				alignItems="center"
			>
				<TagLeftIcon
					boxSize="18px"
					as={type == 'indoor' ? IconBuildingFactory2 : IconTrees}
				/>
				{label}
			</Tag>
			<Box mt="1" >
				<Text textAlign="justify" >{recomendation?.info}</Text>
				<Text textAlign="justify" mt="1">
					<Text as="span" fontWeight={600}>
						Saran :{' '}
					</Text>
					{type == 'indoor'
						? recomendation?.company
						: recomendation?.public}
				</Text>
			</Box>
		</Box>
	);
}
