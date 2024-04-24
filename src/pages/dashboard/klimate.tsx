import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import CardTinyTitle from '../../components/cardWithTinyTitle';
import { IconArrowBarRight, IconDroplet, IconTemperatureSun } from '@tabler/icons-react';
// import data from '../../data/dummyData';

const data : any = {}


// const CLimateTinyChart


export default function ClimateCard() {
	return (
		<CardTinyTitle title="Iklim Mikro" bgTitle="cyan.300">
			<Text>Suhu dan kelembaban di dalam pabrik</Text>
			<Flex flexWrap="wrap">
				<Flex  w='full'>
					<VStack
						flexShrink='0'
						justify="center"
						align='start'
						spacing="0"
						h="full"
						py='6'
						w='80px'
					>
						<HStack mb="-2" color="gray.600">
							<IconTemperatureSun width="1.2em" />
							<Text>Suhu</Text>
						</HStack>
						<Text fontSize="4xl" fontWeight="600" children="33 °C" />
					</VStack>
					<ResponsiveContainer style={{ paddingTop: '30px', marginLeft:'-30px' }}>
						<AreaChart data={data}>
							<Area
								type="monotone"
								dataKey="pv"
								stroke="#82ca9d"
								strokeWidth={2}
								fill="url(#colorPv)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</Flex>
				<Flex  w='full'>
					<VStack
						flexShrink='0'
						justify="center"
						align='start'
						spacing="0"
						h="full"
						py='6'
						w='80px'
					>
						<HStack mb="-2" color="gray.600">
							<IconDroplet width="1.2em" />
							<Text>Kelembaban</Text>
						</HStack>
						<Text fontSize="4xl" fontWeight="600" children="33 %" />
					</VStack>
					<ResponsiveContainer style={{ paddingTop: '30px', marginLeft:'-30px' }}>
						<AreaChart data={data}>
							<Area
								type="monotone"
								dataKey="pv"
								stroke="#82ca9d"
								strokeWidth={2}
								fill="url(#colorPv)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</Flex>
				<Button
					size="sm"
					leftIcon={<IconArrowBarRight width="20px" />}
					colorScheme="teal"
					children="Detail"
				/>
			</Flex>
		</CardTinyTitle>
	);
}
