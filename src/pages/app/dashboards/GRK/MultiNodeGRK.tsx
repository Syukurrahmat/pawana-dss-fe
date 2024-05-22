import {HStack, Tag, Text, VStack, Box} from '@chakra-ui/react'; // prettier-ignore
import { IconCircleDot } from '@tabler/icons-react';
import GaugeChart from 'react-gauge-chart';

interface MultiNodeISPU {
	CH4data: NodeStat<GRKCategorize>;
	CO2data: NodeStat<GRKCategorize>;
}

export default function MultiNodeGRK({ CH4data, CO2data }: MultiNodeISPU) {
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
				py="3"
				border="1px solid"
				borderColor="gray.300"
				rounded="5"
			>
				{xixixi.map(({ symbol, name, threshold, data, max }, i) => {
					const { value, category } = data.average.data.value;

					return (
						<VStack spacing="1" key={i}>
							<HStack color="gray.600" fontSize="lg">
								<Text fontWeight="700">
									{symbol.slice(0, 2)}
									<sub>{symbol[2]}</sub>
								</Text>
								<Text fontWeight="600">{name}</Text>
							</HStack>
							<GaugeChart
								style={{ width: '110px' }}
								arcsLength={threshold}
								colors={['#5BE12C', '#F5CD19', '#EA4228']}
								percent={value / max}
								arcPadding={0.02}
								hideText={true}
							/>
							<Text
								fontSize="xl"
								fontWeight="600"
								children={value + ' PPM'}
							/>
							<Tag
								fontSize="md"
								justifyContent="center"
								w="80%"
								colorScheme="green"
								children={category}
							/>
						</VStack>
					);
				})}
			</HStack>

			<HStack w="full">
				{xixixi.map(({ symbol, data }, i) => {
					const { value, category } = data.average.data.value;

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
							{[1, 1].map((e, i) => (
								<HStack spacing="1" w="full" justify="space-between">
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
											<Text>Tertinggi</Text>
										</HStack>
										<HStack color='gray.600' mt='1'>
											<IconCircleDot size="16" />
											<Text fontSize="sm">Rerata dari node</Text>
										</HStack>
									</Box>
									<VStack spacing="0">
										<Text
											fontSize="lg"
											fontWeight="600"
											children={value + ' PPM'}
										/>
										<Tag
											fontSize="md"
											w="full"
											justifyContent="center"
											colorScheme="green"
											children={category}
										/>
									</VStack>
								</HStack>
							))}
						</VStack>
					);
				})}
			</HStack>
			{/* Tengah */}

			{/* <Stack
				direction="row"
				spacing="4"
				w="full"
				justifyContent="space-evenly"
			>
				{[highest, lowest].map((e, i) => {
					const color = ISPUColor[e.data.value[0].category];
					return (
						<VStack
							key={i}
							minW="200px"
							spacing="0"
							rounded="md"
							align="start"
							px="4"
							py="3"
							justify="center"
							bg={color + '.100'}
						>
							<Text fontWeight="500">
								{i ? 'Terendah' : 'Tertinggi'}
							</Text>
							<HStack w="full" justify="space-between">
								<Text
									fontSize="2xl"
									fontWeight={700}
									children={e.data.value[0].ispu}
								/>
								<Tag bg={color + '.300'}>Aman</Tag>
							</HStack>
							<HStack spacing="1">
								<IconCircleDot size="16" />

								<Text
									w="full"
									noOfLines={1}
									fontSize="sm"
									children={e.node.name}
								/>
							</HStack>
						</VStack>
					);
				})}
			</Stack>
			<Text fontWeight="600" mt="2">
				Kualitas Udara Per Node
			</Text>
			<TableContainer shadow="xs" rounded="md" w="full">
				<Table variant="striped">
					<Thead>
						<Tr>
							<Th>Node</Th>
							<Th>ISPU</Th>
							<Th>Aksi</Th>
						</Tr>
					</Thead>
					<Tbody>
						{list.map(({ node, data: dt }, i) => (
							<Tr key={i}>
								<Td>
									<Text fontWeight="600">{node.name}</Text>
									<Text fontSize="sm" color="gray.600">
										{toFormatedDatetime(dt.datetime)}
									</Text>
								</Td>
								<Td>
									<Tag
										bg={ISPUColor[dt.value[0].category] + '.300'}
										children={dt.value[0].ispu}
									/>
									<Tag
										ml="2"
										bg={ISPUColor[dt.value[0].category] + '.300'}
										children={dt.value[0].category}
									/>
								</Td>
								<Td>
									<Button
										size="sm"
										colorScheme="blue"
										children="Detail ISPU"
									/>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>

			<Spacer />

			<HStack mt="4" color="gray.600">
				<IconHistory size="18" />
				<Text fontSize="sm">
					Data Diperbarui Pada :{' '}
					{toFormatedDatetime(average.data.datetime)}
				</Text>
			</HStack> */}
		</>
	);
}
