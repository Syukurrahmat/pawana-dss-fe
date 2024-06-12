import {
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	HStack,
	Text,
	Flex,
	Tag,
} from '@chakra-ui/react';
import { toFormatedDatetime } from '@/utils/dateFormating';
import { IconDatabase, IconInnerShadowTop, IconTrendingUp} from '@tabler/icons-react'; //prettier-ignore
import SectionTitle from '@/components/common/SectionTitle';
import useSWR, { KeyedMutator } from 'swr';
import MyLineChart from '@/components/Chart/MyLineChart';
import { pageDataFetcher } from '@/utils/fetcher';
import { Box, Skeleton } from '@chakra-ui/react';

interface LastDatalogs {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function DTLastDataSent({ data: pageData }: LastDatalogs) {
	let { nodeId } = pageData;
	const dataApiURL = `/nodes/${nodeId}/datalogs?params=all`;

	const { data } = useSWR<DTDatalog[]>(dataApiURL, pageDataFetcher);

	const params = [
		{ key: 'pm25', name: 'PM2.5', unit: 'µm/m3' },
		{ key: 'pm100', name: 'PM10', unit: 'µm/m3' },
		{ key: 'ch4', name: 'Karbon dioksida', unit: 'PPM' },
		{ key: 'co2', name: 'Metana', unit: 'PPM' },
	];

	return (
		<>
			<SectionTitle IconEl={IconDatabase}>
				24 Jam Data terakhir dikirim
			</SectionTitle>

			{/* <Link to="/data">
					<Button leftIcon={<IconLayoutSidebarLeftExpand />}>
						Lihat Lebih
					</Button>
				</Link> */}
			
			
			<HStack my="3">
				<IconInnerShadowTop size="20" />
				<Text fontWeight="600">Data Terbaru</Text>
				<Tag>{toFormatedDatetime(pageData.lastDataSent)}</Tag>
			</HStack>
			<Flex gap="2">
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
			</Flex>
			<HStack mb="2" mt='4'>
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
					{params.map(({ key }) => (
						<TabPanel key={key}>
							<Box w="full" h="280px" as={!data ? Skeleton : undefined}>
								{!!data && (
									<MyLineChart
										data={data
											.map((e) => ({
												datetime: e.datetime,
												//@ts-ignore
												value: e[key],
											}))
											.reverse()}
									/>
								)}
							</Box>
						</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</>
	);
}
