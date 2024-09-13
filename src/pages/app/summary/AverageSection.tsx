import { GAUGE_CHART_COLORS, MAX_CH4, MAX_CO2, TRESHOLD_CH4, TRESHOLD_CO2, UNIT_PM } from '@/constants/data'; //prettier-ignore
import {
	getCH4Properties,
	getCO2Properties,
	getISPUProperties,
} from '@/utils/common.utils';
import { Box, Center, Flex, HStack, IconButton, Tag, Text, Tooltip, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconInfoSquareRounded } from '@tabler/icons-react';
import GaugeChart from 'react-gauge-chart';
import { CardSection } from '.';

interface AverageSection {
	indoor?: SummaryAverageInsight;
	outdoor?: SummaryAverageInsight;
}

type SubCardContent = {
	key: 'indoor' | 'outdoor';
	label: 'Di dalam' | 'Di luar';
	data?: any;
};

export function ISPUAverageSection({ indoor, outdoor }: AverageSection) {
	const ispuList: SubCardContent[] = [
		{ key: 'indoor', label: 'Di dalam', data: indoor?.ispu?.[0] },
		{ key: 'outdoor', label: 'Di luar', data: outdoor?.ispu?.[0] },
	];

	const polutantList = [
		{
			label: 'Rerata Partikulat (PM) 2.5',
			data: [
				{ key: 'indoor', label: 'Di dalam', data: indoor?.pm25 },
				{ key: 'outdoor', label: 'Di luar', data: outdoor?.pm25 },
			] as SubCardContent[],
		},
		{
			label: 'Rerata Partikulat (PM) 10',
			data: [
				{ key: 'indoor', label: 'Di dalam', data: indoor?.pm100 },
				{ key: 'outdoor', label: 'Di luar', data: outdoor?.pm100 },
			] as SubCardContent[],
		},
	];

	return (
		<>
			<Flex flexWrap="wrap" align="stretch" gap="4">
				<CardSection
					flexGrow="1"
					title="Rerata Indeks Standar Pencemar Udara (ISPU)"
				>
					{ispuList.map(({ label, data }, i) => (
						<Box key={i} flex="1 1 0">
							<Tag
								variant="outline"
								colorScheme={i ? 'green' : 'blue'}
								mb="2"
								children={label}
							/>

							{data ? (
								<HStack spacing="3">
									<Center
										rounded="md"
										p="2"
										bg={
											getISPUProperties(data?.category).colorScheme +
											'.300'
										}
										minW="40px"
									>
										<Text
											fontSize="xl"
											fontWeight="600"
											children={
												data.ispu <= 300 ? data.ispu : '300+'
											}
										/>
									</Center>
									<Box>
										<Text fontWeight="600" fontSize="2xl" mt="-1">
											{data.category}
										</Text>
										<Text fontSize="sm" color="gray.600">
											Polutan Utama : {data.pollutant}
										</Text>
									</Box>
								</HStack>
							) : (
								<InsufficientData />
							)}
						</Box>
					))}
				</CardSection>

				<Flex flexGrow="1" flexWrap="wrap" align="stretch" gap="4">
					{polutantList.map(({ label, data }, i) => (
						<CardSection title={label} key={i}>
							{data.map(({ label, data }, i) => (
								<Box key={i} flex="1 1 0">
									<Tag
										mb="2"
										variant="outline"
										colorScheme={i ? 'green' : 'blue'}
										children={label}
									/>
									{data ? (
										<Center
											alignContent="baseline"
											rounded="md"
											p="2"
											bg={'gray.100'}
										>
											<Text
												fontSize="xl"
												fontWeight="600"
												children={data.toFixed(2)}
											/>
											<Text
												ml="1"
												fontSize="sm"
												children={UNIT_PM}
											/>
										</Center>
									) : (
										<InsufficientData />
									)}
								</Box>
							))}
						</CardSection>
					))}
				</Flex>
			</Flex>
		</>
	);
}

export function GRKAverageSection({ indoor, outdoor }: AverageSection) {
	const gassEmissionList = [
		{
			key: 'ch4',
			label: 'Emisi Gas Metana Rata-Rata',
			data: [
				{ key: 'indoor', label: 'Di dalam', data: indoor?.ch4 },
				{ key: 'outdoor', label: 'Di luar', data: outdoor?.ch4 },
			] as SubCardContent[],
			threshold: TRESHOLD_CH4,
			max: MAX_CH4,
			unit: 'PPM',
		},
		{
			key: 'co2',
			label: 'Emisi Gas Karbonioksida Rata-Rata',
			data: [
				{ key: 'indoor', label: 'Di dalam', data: indoor?.co2 },
				{ key: 'outdoor', label: 'Di luar', data: outdoor?.co2 },
			] as SubCardContent[],
			threshold: TRESHOLD_CO2,
			max: MAX_CO2,
			unit: 'PPM',
		},
	];

	return (
		<Flex align="stretch" flexDir={{ base: 'column', lg: 'row' }} gap="4">
			{gassEmissionList.map(({ label, data, unit, threshold, max, key }) => (
				<CardSection key={key} title={label}>
					{data.map(({ label, data }, i) => {
						const { colorScheme } =
							key == 'co2'
								? getCO2Properties(data?.category)
								: getCH4Properties(data?.category);

						return (
							<Box key={i} flex="1 1 0">
								<Tag
									variant="outline"
									colorScheme={i ? 'green' : 'blue'}
									mb="2"
									children={label}
								/>

								{data ? (
									<HStack justify="center" wrap="wrap-reverse">
										<VStack spacing="1" align="stretch">
											<Center
												alignContent="baseline"
												rounded="md"
												p="2"
												bg={colorScheme + '.200'}
											>
												<Text
													fontSize="xl"
													fontWeight="700"
													children={data.value.toFixed(2)}
												/>
												<Text
													ml="1"
													fontSize="sm"
													children={unit}
												/>
											</Center>
											<Tag
												w="full"
												fontSize="md"
												justifyContent="center"
												colorScheme={colorScheme}
												children={data.category}
											/>
										</VStack>

										<GaugeChart
											style={{ width: '120px' }}
											arcsLength={threshold}
											colors={GAUGE_CHART_COLORS}
											percent={
												data.value >= max ? 1 : data.value / max
											}
											arcPadding={0.02}
											hideText={true}
										/>
									</HStack>
								) : (
									<InsufficientData />
								)}
							</Box>
						);
					})}
				</CardSection>
			))}
		</Flex>
	);
}

function InsufficientData() {
	return (
		<HStack py='8px' justify='center' align='center' color="gray.400" spacing="1" >
			<Text fontWeight="600" w='max-content' size="sm" textAlign="center">
				Data tidak lengkap
			</Text>
			<Tooltip label="Rerata parameter udara tidak dapat dihitung karena data yang ada tidak mencukupi">
				<IconButton
					aria-label="info"
					size="xs"
					variant='transparant'
					icon={<IconInfoSquareRounded size="18" />}
				/>
			</Tooltip>
		</HStack>
	);
}
