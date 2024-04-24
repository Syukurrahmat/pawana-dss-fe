import { Box, Card, CardBody, HStack, Heading, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'; // prettier-ignore
import { LatLngTuple, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function getBonds(nodes: LatLngTuple[]) {
	let x_min = nodes[0][0];
	let y_min = nodes[0][1];
	let x_max = nodes[0][0];
	let y_max = nodes[0][1];

	for (let i = 1; i < nodes.length; i++) {
		let x = nodes[i][0];
		let y = nodes[i][1];
		if (x < x_min) x_min = x;
		if (x > x_max) x_max = x;
		if (y < y_min) y_min = y;
		if (y > y_max) y_max = y;
	}

	return latLngBounds([x_min, y_max], [x_max, y_min]);
}
const nodes: LatLngTuple[] = [
	[-7.3707116, 110.8910556],
	[-7.3717116, 110.8920556],
	[-7.3701116, 110.8930556],
];
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Tag,
} from '@chakra-ui/react';
import { useEffect } from 'react';

export default function ISPUTap() {
	useEffect(() => {
		console.log('location.pathname');
	}, []);

	return (
		<VStack align="start" w="full" spacing="4">
			<Box as="section">
				<Heading mb="1" size="md">
					Indeks Standar Pencemar Udara (ISPU)
				</Heading>
				<Text>
					Ispu adalah Lorem ipsum dolor sit amet consectetur adipisicing
					elit. Dicta quis velit aliquid iste ea assumenda ut
					exercitationem labore, enim dolore? Lorem ipsum dolor sit amet
					consectetur adipisicing elit. Dicta quis velit aliquid iste ea
					assumenda ut exercitationem labore, enim dolore? Lorem ipsum
					dolor sit amet consectetur adipisicing elit. Dicta quis velit
					aliquid iste ea assumenda ut exercitationem labore, enim dolore?
				</Text>
			</Box>
			<Box >
				<Heading mb="3" size="md">
					ISPU per node
				</Heading>
				<Card>
					<CardBody as={HStack}>
						<TableContainer>
							<Table>
								<Thead>
									<Tr>
										<Th>Node</Th>
										<Th>ISPU</Th>
									</Tr>
								</Thead>
								<Tbody>
									<Tr>
										<Td>inches</Td>
										<Td>
											<Tag colorScheme="teal">22</Tag>
										</Td>
									</Tr>
									<Tr>
										<Td>feet</Td>
										<Td>
											<Tag colorScheme="teal">22</Tag>
										</Td>
									</Tr>
									<Tr>
										<Td>yards</Td>
										<Td>
											<Tag colorScheme="teal">22</Tag>
										</Td>
									</Tr>
								</Tbody>
							</Table>
						</TableContainer>
						<Box w='500px'>
							<MapContainer
								bounds={getBonds(nodes)}
								style={{
									height: '250px',
									flex: '1 0 60%',
								}}
								boundsOptions={{ padding: [50, 50] }}
								scrollWheelZoom={false}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								{nodes.map((e, i) => (
									<CircleMarker
										key={i}
										center={e}
										pathOptions={{ fillColor: 'blue' }}
										radius={20}
									>
										2
									</CircleMarker>
								))}
							</MapContainer>
						</Box>
					</CardBody>
				</Card>
			</Box>
		</VStack>
	);
}
