import { GAUGE_CHART_COLORS, MAX_CH4, MAX_CO2, TRESHOLD_CH4, TRESHOLD_CO2 } from '@/constants/data';
import { getCH4Properties, getCO2Properties } from '@/utils/common.utils';
import { Box, HStack, Icon, Spacer, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconHistory } from '@tabler/icons-react';
import moment from 'moment';
import GaugeChart from 'react-gauge-chart';

interface MultiNodeISPU {
	CH4data: NodeStat<GRKValue>;
	CO2data: NodeStat<GRKValue>;
}

export default function MultiNodeGRK({ CH4data, CO2data }: MultiNodeISPU) {
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
				py="3"
				border="1px solid"
				borderColor="gray.300"
				rounded="5"
			>
				{grkEmissionList.map(
					({ symbol, name, threshold, data, max }, i) => {
						const { value, category } = data.average.data.value;
						const { colorScheme } =
							symbol == 'CO2'
								? getCO2Properties(category)
								: getCH4Properties(category);

						return (
							<VStack spacing="1" key={i} h="86px">
								<HStack
									color="gray.600"
									alignSelf="start"
									fontSize="lg"
									spacing="1"
								>
									<Text fontWeight="600">
										{symbol.slice(0, 2)}
										<sub>{symbol[2]}</sub>
									</Text>
									<Text fontWeight="600">{name}</Text>
								</HStack>
								<HStack>
									<Box>
										<Text
											fontSize="xl"
											fontWeight="600"
											children={value + ' PPM'}
										/>
										<Tag
											w="full"
											fontSize="md"
											justifyContent="center"
											colorScheme={colorScheme}
											children={category}
										/>
									</Box>
									<GaugeChart
										style={{ width: '125px' }}
										arcsLength={threshold}
										colors={GAUGE_CHART_COLORS}
										percent={value >= max ? 1 : value / max}
										arcPadding={0.02}
										hideText={true}
									/>
								</HStack>
							</VStack>
						);
					}
				)}
			</HStack>

			<HStack w="full">
				{grkEmissionList.map(({ symbol, data }, i) => {
					return (
						<VStack
							flex="1 1 0px"
							key={i}
							border="1px solid"
							borderColor="gray.300"
							rounded="5"
							py="2"
							px="4"
						>
							{[data.highest, data.lowest].map(
								({ name, data: { value } }, i) => (
									<HStack
										spacing="1"
										w="full"
										key={i}
										justify="space-between"
									>
										<Box>
											<HStack
												color="gray.700"
												spacing="1"
												fontWeight="600"
											>
												<Text>
													{symbol.slice(0, 2)}
													<sub>{symbol[2]}</sub>
												</Text>
												<Text>{i ? 'Terendah' : 'Tertinggi'}</Text>
											</HStack>
											<HStack color="gray.600" mt="1">
												<Text fontSize="sm">{name}</Text>
											</HStack>
										</Box>
										<VStack spacing="0">
											<Text
												fontSize="lg"
												fontWeight="600"
												children={value.value + ' PPM'}
											/>
											<Tag
												fontSize="md"
												w="full"
												justifyContent="center"
												colorScheme={
													(symbol == 'CO2'
														? getCO2Properties(value.category)
														: getCH4Properties(value.category)
													).colorScheme
												}
												children={value.category}
											/>
										</VStack>
									</HStack>
								)
							)}
						</VStack>
					);
				})}
			</HStack>
			<Spacer />
			<HStack justify="end" w="full">
				<Icon as={IconHistory} boxSize="18px" />
				<Text>
					Data diperbarui pada{' '}
					{moment(CH4data.average.data.datetime).format(
						'HH:mm DD MMM YYYY'
					)}
				</Text>
			</HStack>
		</>
	);
}
