import MyLineChart from '@/components/Chart/MyLineChart';
import SectionTitle from '@/components/common/SectionTitle';
import { toFormatedDatetime } from '@/utils/dateFormating';
import { Box, Center, Flex, HStack, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconDatabase, IconInnerShadowTop, IconTrendingUp } from '@tabler/icons-react';  //prettier-ignore
import { KeyedMutator } from 'swr';

interface LastDatalogs {
	mutate: KeyedMutator<any>;
	data: DTDatalog[];
	lastDataSent?: string;
}

export default function DTLastDataSent({ data, lastDataSent }: LastDatalogs) {
	const params = [
		{ key: 'pm25', name: 'PM2.5', unit: 'µm/m3' },
		{ key: 'pm100', name: 'PM10', unit: 'µm/m3' },
		{ key: 'ch4', name: 'Karbon dioksida', unit: 'PPM' },
		{ key: 'co2', name: 'Metana', unit: 'PPM' },
	];

	return (
		<>
			<SectionTitle IconEl={IconDatabase}>
				Data terakhir dikirim
			</SectionTitle>

			{!!lastDataSent ? (
				<>
					<HStack my="3">
						<IconInnerShadowTop size="20" />
						<Text fontWeight="600">Data Terbaru</Text>
						<Tag>{toFormatedDatetime(lastDataSent)}</Tag>
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
							{params.map(({ key }) => (
								<TabPanel key={key}>
									<Box
										w="full"
										h="280px"
										as={!data ? Skeleton : undefined}
									>
										{!!data && (
											<MyLineChart
												data={data}
												simple
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
				</>
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
