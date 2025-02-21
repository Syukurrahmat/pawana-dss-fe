import MyISPUChart from '@/components/Chart/ISPUChart';
import MyLineChart from '@/components/Chart/MyLineChart';
import { UNIT_PM } from '@/constants/data';
import { getISPUProperties } from '@/utils/common.utils';
import { Box, Flex, HStack, Heading, Icon, Spacer, StackDivider, StackProps, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconDatabaseX, IconHistory } from '@tabler/icons-react';
import moment from 'moment';

interface SingleNodeISPU {
	data: SingleNodeAnalysisItem<ISPUValue>;
}

export default function SingleNodeISPU({ data }: SingleNodeISPU) {
	const {
		latestData: { datetime, value },
		tren,
	} = data;

	return (
		<>
			{value ? (
				<>
					<FinalISPUCard value={value[0]} />

					<HStack
						justify="space-evenly"
						align="start"
						wrap="wrap"
						w="full"
					>
						<Spacer />

						{value.map((e, i) => (
							<EachISPUCard
								flex="1 1 180px"
								value={e}
								key={i}
							/>
						))}
						<Spacer />
					</HStack>
				</>
			) : (
				<ISPUCannotAnalize />
			)}

			{/* TREN  */}

			<Tabs w="full">
				<TabList>
					<Tab>Tren ISPU</Tab>
					<Tab>Tren Pencemar</Tab>
				</TabList>
				<TabPanels>
					{/* ISPU TREN */}

					<TabPanel px="0">
						<Box h="110px">
							<Text fontWeight="600" mb="2">
								Tren ISPU PM2.5
							</Text>
							<MyISPUChart
								data={tren}
								simple
								tooltipLabel="ISPU PM2.5"
								dataKeyTypeAndFunc={{
									func: (e) => (e.value || []).find((f) => f.pollutant == 'PM25')!, //prettier-ignore
								}}
							/>
						</Box>
						<Box mt="8" h="110px">
							<Text fontWeight="600" mb="2">
								Tren ISPU PM10
							</Text>
							<MyISPUChart
								data={tren}
								tooltipLabel="ISPU PM10"
								simple
								dataKeyTypeAndFunc={{
									func: (e) => (e.value || []).find((f) => f.pollutant == 'PM100')!, //prettier-ignore
								}}
							/>
						</Box>
					</TabPanel>

					{/* Pencemar TREN */}

					<TabPanel px="0">
						<Box h="110px">
							<Text fontWeight="600" mb="2">
								Tren Pencemar PM2.5
							</Text>
							<MyLineChart
								simple
								gasType="PM2.5"
								data={tren}
								dataKeyTypeAndFunc={{
									func: (e) =>
										(e.value || []).find(
											(e) => e.pollutant == 'PM25'
										),
								}}
							/>
						</Box>
						<Box mt="8" h="110px">
							<Text fontWeight="600" mb="2">
								Tren Pencemar PM10
							</Text>
							<MyLineChart
								simple
								gasType="PM10"
								data={tren}
								dataKeyTypeAndFunc={{
									func: (e) =>
										(e.value || []).find(
											(e) => e.pollutant == 'PM100'
										),
								}}
							/>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Spacer />
			{!!value && (
				<HStack justify="end" w="full">
					<Icon as={IconHistory} boxSize="18px" />
					<Text>
						ISPU Pukul {moment(datetime).format('HH:mm DD MMM YYYY')}
					</Text>
				</HStack>
			)}
		</>
	);
}

function EachISPUCard({ value, ...r }: StackProps & { value: ISPUValueItem }) {
	const { category, ispu, pollutant, pollutantValue } = value;
	const { colorScheme } = getISPUProperties(category);

	return (
		<HStack
			as={Flex}
			bg={colorScheme + '.100'}
			py="6px"
			h="59px"
			px="4"
			rounded="md"
			spacing="4"
			divider={<StackDivider borderColor={colorScheme + '.200'} />}
			{...r}
		>
			<Text fontSize="xl" fontWeight="600" children={pollutant} />

			<Box>
				<Text
					fontSize="2xl"
					fontWeight="600"
					children={ispu <= 300 ? ispu : '300+'}
				/>
				<Text fontSize="sm" mt="-1" noOfLines={1}>
					{pollutantValue.toFixed(2)} {UNIT_PM}
				</Text>
			</Box>
		</HStack>
	);
}

export function FinalISPUCard({
	value,
	...r
}: StackProps & { value: ISPUValueItem }) {
	const { category, ispu, pollutant } = value;
	const { colorScheme, icon } = getISPUProperties(category);

	return (
		<HStack
			w="full"
			spacing="4"
			p="2"
			bg={colorScheme + '.100'}
			rounded="5"
			{...r}
		>
			<VStack
				rounded="3"
				align="start"
				boxSize={{ base: '80px', md: '95px' }}
				p="2"
				spacing="0"
				bg={colorScheme + '.200'}
			>
				<Text fontStyle="italic" children="ISPU" />
				<Spacer />
				<Text textAlign="center" w="full" fontSize="4xl" fontWeight="600">
					{ispu <= 300 ? ispu : '300+'}
				</Text>
			</VStack>

			<VStack align="start" spacing="2" flex="1 0 0">
				<Heading as="p" size="lg">
					{category}
				</Heading>
				<Tag colorScheme={colorScheme} variant="outline">
					<Text lineHeight="1.5em">
						Polutan Utama :{' '}
						<Text fontWeight="600" as="span">
							{' '}
							{pollutant}
						</Text>
					</Text>
				</Tag>
			</VStack>
			<Icon
				boxSize={{ base: '70px', md: '90px' }}
				strokeWidth="1.5px"
				color={colorScheme + '.400'}
				as={icon}
			/>
		</HStack>
	);
}

export function ISPUCannotAnalize() {
	return (
		<HStack
			flexGrow="1"
			w="full"
			spacing="4"
			px="2"
			py="8"
			rounded="5"
			color="gray.500"
		>
			<Icon boxSize="60px" strokeWidth="1.5px" as={IconDatabaseX} />
			<Box>
				<Text fontWeight="600" fontSize="xl" color="gray.600">
					ISPU Terkini tidak dapat dikalkulasi
				</Text>
				<Text>
					Data tidak mencukupi, tunggu sensor mengirimkan data tambahan.{' '}
				</Text>
			</Box>
		</HStack>
	);
}
