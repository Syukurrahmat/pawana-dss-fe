import MyLineChart from '@/components/Chart/MyLineChart';
import SectionTitle from '@/components/common/SectionTitle';
import { UNIT_CH4, UNIT_PM } from '@/constants/data';
import useUser from '@/hooks/useUser';
import { toFormatedDatetime } from '@/utils/dateFormating';
import { Box, Center, Grid, HStack, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconDatabase, IconInfoCircle, IconInnerShadowTop, IconTrendingUp } from '@tabler/icons-react'; //prettier-ignore
import { KeyedMutator } from 'swr';

interface LastDatalogs {
	mutate: KeyedMutator<any>;
	data: DTDatalog[];
	lastDataSent?: string;
}

export default function LastDataSentSection({
	data,
	lastDataSent,
}: LastDatalogs) {
	const { user } = useUser();
	
	const params = [
		{ key: 'pm25', name: 'PM2.5', gasType: 'PM2.5', unit: UNIT_PM },
		{ key: 'pm100', name: 'PM10', gasType: 'PM10', unit: UNIT_PM },
		{ key: 'co2', name: 'Karbon dioksida', gasType: 'CO2', unit: UNIT_CH4 },
		{ key: 'ch4', name: 'Metana', gasType: 'CH4', unit: UNIT_CH4 },
	];

	return (
		<>
			<SectionTitle IconEl={IconDatabase}>
				Data terakhir dikirim
			</SectionTitle>

			{!!lastDataSent ? (
				<Box>
					<HStack my="3">
						<IconInnerShadowTop size="20" />
						<Text fontWeight="600">Data Terbaru</Text>
						<Tag>{toFormatedDatetime(lastDataSent)}</Tag>
					</HStack>
					<Grid
						gap="2"
						templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
					>
						{params.map(({ name, key, unit }) => (
							<Box
								key={key}
								flex="1 0 0px"
								py="2"
								px="4"
								border="2px solid"
								borderColor="gray.200"
								rounded="md"
							>
								<Text fontWeight="600">{name}</Text>
								<HStack align="baseline">
									<Text
										fontWeight="600"
										fontSize="xl"
										// @ts-ignore
										children={data && data[0][key]}
									/>
									<Text fontSize="sm">{unit}</Text>
								</HStack>
							</Box>
						))}
					</Grid>
					<HStack mb="2" mt="4">
						<IconTrendingUp size="20" />
						<Text fontWeight="600">Tren 24 jam terakhir</Text>
					</HStack>
					<Tabs isLazy size="sm">
						<TabList>
							{params.map(({ name, key }) => (
								<Tab key={key}>{name}</Tab>
							))}
						</TabList>

						<TabPanels>
							{params.map(({ key, gasType }) => (
								<TabPanel key={key} px="0">
									<Box
										w="full"
										h="280px"
										as={!data ? Skeleton : undefined}
									>
										{!!data && (
											<MyLineChart
												data={data}
												simple
												gasType={gasType as any}
												dataKeyTypeAndFunc={{
													//@ts-ignore
													func: (e) => ({ value: e[key] }),
												}}
											/>
										)}
									</Box>
								</TabPanel>
							))}
						</TabPanels>
					</Tabs>
					{user.role !== 'regular' && (
						<HStack>
							<IconInfoCircle size="18" />
							<Text>
								Pergi ke menu <strong>Data</strong> untuk mengunduh data
							</Text>
						</HStack>
					)}
				</Box>
			) : (
				<Center w="full" py="5">
					<Text fontWeight="600" color="gray.500" fontSize="xl">
						Node Belum Pernah Mengirim Data
					</Text>
				</Center>
			)}
		</>
	);
}
