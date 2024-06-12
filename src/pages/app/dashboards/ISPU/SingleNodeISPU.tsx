import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, HStack, Heading, Spacer, StackDivider, Tag, Text, VStack, Icon, Flex} from '@chakra-ui/react'; // prettier-ignore
import { IconCircleDot, IconHistory, IconMoodHappy } from '@tabler/icons-react';
import { toFormatedDatetime } from '@/utils/dateFormating';
import { ISPUColor } from '@/utils/common.utils';
import MyISPUChart from '@/components/Chart/ISPUChart';
import MyLineChart from '@/components/Chart/MyLineChart';

interface SingleNodeISPU {
	data: SingleNodeAnalysisItem<[ISPUValue,ISPUValue]>;
}

export default function SingleNodeISPU({ data }: SingleNodeISPU) {
	const { latestData : {datetime, value}, tren } = data as SingleNodeAnalysisItem<[ISPUValue,ISPUValue]>; // prettier-ignore


	const highestISPU = value[0]
	const color = ISPUColor[highestISPU.category];

	return (
		<>
			{/* Header */}
			<HStack w="full" spacing="4" p="2" bg={color + '.100'} rounded="5">
				<VStack
					rounded="3"
					align="start"
					boxSize="95px"
					p="2"
					spacing="0"
					bg={color + '.200'}
				>
					<Text fontStyle="italic" children="ISPU" />
					<Spacer />
					<Text
						textAlign="center"
						w="full"
						fontSize="4xl"
						fontWeight="700"
					>
						{highestISPU.ispu}
					</Text>
				</VStack>

				<VStack align="start" spacing="2">
					<Heading as="p" size="lg">
						{highestISPU.category}
					</Heading>
					<Tag>Polutan Utama : {highestISPU.pollutant}</Tag>
				</VStack>
				<Spacer />
				<Icon
					boxSize="90px"
					strokeWidth="1.5px"
					color={color + '.400'}
					as={IconMoodHappy}
				/>
			</HStack>

			{/* Tengah */}

			<HStack justify="space-evenly" w="full">
				{value.map((e, i) => (
					<HStack
						key={i}
						as={Flex}
						bg={color + '.100'}
						py="6px"
						h="59px"
						px="4"
						w="170px"
						rounded="md"
						spacing="4"
						divider={<StackDivider borderColor={color + '.200'} />}
					>
						<Text
							flex="2 1 0px"
							fontSize="xl"
							fontWeight="600"
							children={e.pollutant}
						/>

						<Box flex="3 1 0px">
							<Text fontSize="2xl" fontWeight="600" children={e.ispu} />
							<Text
								fontSize="sm"
								mt="-1"
								children={e.pollutantValue.toFixed(2) + ' µg/m³'}
							/>
						</Box>
					</HStack>
				))}
			</HStack>

			{/* TREN  */}

			<Tabs w="full">
				<TabList>
					<Tab>Tren ISPU</Tab>
					<Tab>Tren Pencemar</Tab>
				</TabList>
				<TabPanels>
					{/* ISPU TREN */}

					<TabPanel>
						<Box h="110px">
							<Text fontWeight="600" mb="2">
								Tren ISPU PM2.5
							</Text>
							<MyISPUChart
								data={tren
									.map(({ datetime, value }) => ({
										datetime,
										value:
											value.find((e) => e.pollutant == 'PM25')
												?.ispu || 301,
									}))
									.reverse()}
							/>
						</Box>
						<Box mt="8" h="110px">
							<Text fontWeight="600" mb="2">
								Tren ISPU PM10
							</Text>
							<MyISPUChart
								data={tren.map(({ datetime, value }) => {
									let v =
										value.find((e) => e.pollutant == 'PM100')?.ispu ||
										301;

									return {
										datetime,
										value: v !== null ? v : 301,
									};
								})}
							/>
						</Box>
					</TabPanel>

					{/* Pencemar TREN */}

					<TabPanel>
						<Box h="110px">
							<Text fontWeight="600" mb="2">
								Tren Pencemar PM2.5
							</Text>
							<MyLineChart
								data={tren
									.map(({ datetime, value }) => ({
										datetime: new Date(datetime).getTime(),
										value: value.find((e) => e.pollutant == 'PM25')
											?.pollutantValue,
									}))
									.reverse()}
							/>
						</Box>
						<Box mt="8" h="110px">
							<Text fontWeight="600" mb="2">
								Tren Pencemar PM10
							</Text>
							<MyLineChart
								data={tren
									.map(({ datetime, value }) => ({
										datetime: new Date(datetime),
										value: value.find((e) => e.pollutant == 'PM100')
											?.pollutantValue,
									}))
									.reverse()}
							/>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</>
	);
}

export function formatDateToHHMM(date: Date) {
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
}
