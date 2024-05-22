import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, HStack, Spacer, Tag, Text, VStack} from '@chakra-ui/react'; // prettier-ignore
import { IconHistory } from '@tabler/icons-react';
import { toFormatedDatetime } from '@/utils/dateFormating';
import GaugeChart from 'react-gauge-chart';
import MyLineChart from '@/components/chart/MyLineChart';

interface SingleNodeISPU {
	CO2data: SingleNodeAnalysisItem<GRKCategorize, number>;
	CH4data: SingleNodeAnalysisItem<GRKCategorize, number>;
}

export default function SingleNodeGRK({ CO2data, CH4data }: SingleNodeISPU) {
	const xixixi = [
		{
			symbol: 'CH4',
			name: 'Metana',
			threshold: [0.3, 0.5, 0.2],
			max: 10000,
			data: CH4data,
		},
		{
			symbol: 'CO2',
			name: 'Karbondioksida',
			max: 2000,
			threshold: [0.3, 0.5, 0.2],
			data: CO2data,
		},
	];

	return (
		<>
			{/* Header */}

			<HStack
				w="full"
				justify="space-evenly"
				px="2"
				h="calc(168px + 1em)"
				border="1px solid"
				borderColor="gray.300"
				rounded="5"
			>
				{xixixi.map(({ symbol, name, threshold, data, max }, i) => {
					const { value, category } = data.current.value;

					return (
						<VStack spacing="1" key={i}>
							<HStack color="gray.600" fontSize="lg">
								<Text fontWeight="700">
									{symbol.slice(0, 2)}
									<sub>{symbol[2]}</sub>
								</Text>
								<Text fontWeight="500">{name}</Text>
							</HStack>
							<GaugeChart
								style={{ width: '125px' }}
								arcsLength={threshold}
								colors={['#5BE12C', '#F5CD19', '#EA4228']}
								percent={value / max}
								arcPadding={0.02}
								hideText={true}
							/>
							<Text
								fontSize="2xl"
								fontWeight="600"
								children={value + ' PPM'}
							/>
							<Tag
								w="full"
								fontSize="md"
								justifyContent="center"
								colorScheme="green"
								children={category}
							/>
						</VStack>
					);
				})}
			</HStack>
			<Tabs w="full">
				<TabList>
					<Tab _active={{ bg: 'initial' }}>Tren Gas Emisi Rumah Kaca</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Box h="110px" w="full">
							<Text fontWeight="600" mb="2">
								Tren Gas Metana (CH4)
							</Text>
							<MyLineChart
								data={CH4data.tren
									.map(({ datetime, value }) => ({
										datetime: new Date(datetime).getTime(),
										value,
									}))
									.reverse()}
							/>
						</Box>
						<Box mt="8" h="110px" w="full">
							<Text fontWeight="600" mb="2">
								Tren Karbondioksida (CO2)
							</Text>
							<MyLineChart
								data={CO2data.tren
									.map(({ datetime, value }) => ({
										datetime: new Date(datetime).getTime(),
										value,
									}))
									.reverse()}
							/>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>

			<Spacer />
			<HStack color="gray.600">
				<IconHistory size="18" />
				<Text fontSize="sm">
					Data Diperbarui Pada :{' '}
					{toFormatedDatetime(CO2data.current.datetime)}
				</Text>
			</HStack>
		</>
	);
}
