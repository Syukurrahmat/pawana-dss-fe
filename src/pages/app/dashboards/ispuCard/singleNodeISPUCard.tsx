import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, HStack, Heading, Spacer, StackDivider, Tag, Text, VStack} from '@chakra-ui/react'; // prettier-ignore
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'; // prettier-ignore
import { IconBuildingFactory2, IconMoodHappy } from '@tabler/icons-react';
import moment from 'moment';


 
interface SNISPUCardProps {
	title: string;
	data: singleNodeDataType;
}

export default function SingleNodeISPUCard({ title, data }: SNISPUCardProps) {
	const { ispu, category, mainPollutant } = data.ispu.currentISPU;
	const { ISPUTren, allCurrentISPU } = data.ispu;

	return (
		<VStack spacing="4" align="start" w="50%">
			<HStack align="center">
				<IconBuildingFactory2 width="28px" />
				<Text fontWeight="600">{title}</Text>
			</HStack>

			{/* Header */}

			<HStack w="full" spacing="4" p="2" bg="red.100" rounded="5">
				<VStack
					rounded="3"
					align="start"
					boxSize="95px"
					p="2"
					spacing="0"
					bg="red.200"
				>
					<Text fontStyle="italic" children="ISPU" />
					<Spacer />
					<Text
						textAlign="center"
						w="full"
						fontSize="4xl"
						fontWeight="700"
					>
						{ispu}
					</Text>
				</VStack>

				<VStack align="start" spacing="0">
					<Heading as="p" size="lg">
						{category}
					</Heading>
					<Tag mt="1.5">Polutan Utama : {mainPollutant}</Tag>
				</VStack>
				<Spacer />
				<IconMoodHappy
					size="90px"
					strokeWidth="1.5px"
					color="var(--chakra-colors-red-400)"
				/>
			</HStack>

			{/* Tengah */}
			<HStack justify="space-evenly" w="full">
				<DetailISPUMiniCard
					pollutant="PM2.5"
					ispu={allCurrentISPU.pm25.ispu}
					value={allCurrentISPU.pm25.value}
				/>
				<DetailISPUMiniCard
					pollutant="PM10"
					ispu={allCurrentISPU.pm100.ispu}
					value={allCurrentISPU.pm100.value}
				/>
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
							<MyBarChart
								data={ISPUTren.map(({ datetime, pm25 }) => ({
									datetime,
									value: pm25.ispu,
								}))}
							/>
						</Box>
						<Box mt="8" h="110px">
							<Text fontWeight="600" mb="2">
								Tren ISPU PM10
							</Text>
							<MyBarChart
								data={ISPUTren.map(({ datetime, pm100 }) => ({
									datetime,
									value: pm100.ispu,
								}))}
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
								data={data.tren.map(({ datetime, pm25 }) => ({
									datetime: new Date(datetime).getTime(),
									value: pm25,
								}))}
							/>
						</Box>
						<Box mt="8" h="110px">
							<Text fontWeight="600" mb="2">
								Tren Pencemar PM10
							</Text>
							<MyLineChart
								data={data.tren.map(({ datetime, pm100 }) => ({
									datetime: new Date(datetime).getTime(),
									value: pm100,
								}))}
							/>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</VStack>
	);
}

function MyBarChart({ data }: { data: any[] }) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				data={data}
				margin={{
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
				}}
			>
				<XAxis
					dataKey="datetime"
					tickFormatter={(e) => moment(e).format('HH:MM')}
				/>
				<Tooltip labelFormatter={(e) => new Date(e).getHours()} />
				<Bar
					radius={[3, 3, 0, 0]}
					dataKey="value"
					fill="var(--chakra-colors-green-400)"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}

function MyLineChart({ data }: { data: any[] }) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={data}
				margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id="colorId" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis
					dataKey="datetime"
					type="number"
					domain={['dataMin-10000', 'dataMax+10000']}
					tickFormatter={(e) => formatDateToHHMM(new Date(e))}
				/>
				<YAxis width={30} domain={[0, 'dataMax+0.3']} />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="value"
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorId)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}

interface DISPUMiniCardProps {
	pollutant: 'PM2.5' | 'PM10';
	ispu: number;
	value: number;
}

function DetailISPUMiniCard({ pollutant, ispu, value }: DISPUMiniCardProps) {
	return (
		<HStack
			bg="red.100"
			py="6px"
			rounded="md"
			divider={<StackDivider borderColor="red.200" />}
		>
			<Text w="70px" px="2" textAlign="right" fontSize="xl" fontWeight="600">
				{pollutant}
			</Text>

			<Box w="90px" px="2">
				<Text fontSize="2xl" fontWeight="600">
					{ispu}
				</Text>
				<Text fontSize="sm" mt="-1">
					{value.toFixed(2)} µg/m³
				</Text>
			</Box>
		</HStack>
	);
}

function formatDateToHHMM(date: Date) {
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
}
