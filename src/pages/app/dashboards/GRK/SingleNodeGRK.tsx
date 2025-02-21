import MyLineChart from '@/components/Chart/MyLineChart';
import {
	GAUGE_CHART_COLORS,
	MAX_CH4,
	MAX_CO2,
	TRESHOLD_CH4,
	TRESHOLD_CO2,
} from '@/constants/data';
import { getCH4Properties, getCO2Properties } from '@/utils/common.utils';
import { Box, HStack, Icon, Spacer, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconHistory } from '@tabler/icons-react';
import moment from 'moment';
import GaugeChart from 'react-gauge-chart';

interface SingleNodeISPU {
	CO2data: SingleNodeAnalysisItem<GRKValue>;
	CH4data: SingleNodeAnalysisItem<GRKValue>;
}

export default function SingleNodeGRK({ CO2data, CH4data }: SingleNodeISPU) {
	const grkEmissionList = [
		{
			symbol: 'CO2',
			name: 'Karbondioksida',
			max: MAX_CO2,
			threshold: TRESHOLD_CO2,
			data: CO2data,
		},
		{
			symbol: 'CH4',
			name: 'Metana',
			threshold: TRESHOLD_CH4,
			max: MAX_CH4,
			data: CH4data,
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
				{grkEmissionList.map(
					({ symbol, name, threshold, data, max }, i) => {
						const { value, category } = data.latestData.value;
						const { colorScheme } =
							symbol == 'CO2'
								? getCO2Properties(category)
								: getCH4Properties(category);

						return (
							<VStack spacing="1" key={i}>
								<HStack color="gray.600" fontSize="lg">
									<Text fontWeight="600">
										{symbol.slice(0, 2)}
										<sub>{symbol[2]}</sub>
									</Text>
									<Text fontWeight="500">{name}</Text>
								</HStack>
								<GaugeChart
									style={{ maxWidth: '125px', width: '100%' }}
									arcsLength={threshold}
									colors={GAUGE_CHART_COLORS}
									percent={value > max ? 1 : value / max}
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
									py="1"
									justifyContent="center"
									colorScheme={colorScheme}
									children={category}
								/>
							</VStack>
						);
					}
				)}
			</HStack>
			<Tabs w="full">
				<TabList>
					<Tab _active={{ bg: 'initial' }}>Tren Gas Emisi Rumah Kaca</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Box h="110px" w="full">
							<Text fontWeight="600" mb="2">
								Tren Karbondioksida (CO2)
							</Text>
							<MyLineChart
								simple
								gasType="CO2"
								data={CO2data.tren}
								dataKeyTypeAndFunc={{
									func: (e) => e.value,
								}}
							/>
						</Box>
						<Box  mt="8" h="110px" w="full">
							<Text fontWeight="600" mb="2">
								Tren Gas Metana (CH4)
							</Text>
							<MyLineChart
								simple
								data={CH4data.tren}
								gasType="CH4"
								dataKeyTypeAndFunc={{
									func: (e) => e.value,
								}}
							/>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>

			<Spacer />
			<HStack justify="end" w="full">
				<Icon as={IconHistory} boxSize="18px" />
				<Text>
					Data diperbarui pada{' '}
					{moment(CH4data.latestData.datetime).format('HH:mm DD MMM YYYY')}
				</Text>
			</HStack>
		</>
	);
}
