import { Box, Button, Card, CardBody, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'; // prettier-ignore
import { IconAddressBook, IconUser } from '@tabler/icons-react';
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

export default function GroupInfoDash() {
	const nodes: LatLngTuple[] = [
		[-7.3707116, 110.8910556],
		[-7.3717116, 110.8920556],
		[-7.3701116, 110.8930556],
	];

	return (
		<Card size="sm" w="full">
			<CardBody as={Flex} gap="1em">
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

				<VStack p="3" flex="0 0 auto" spacing="3" color="gray.700" w="auto">
					<Heading size="md">Grup Pabrik Hargasari</Heading>
					<Box>
						<Flex align="start" maxW="450px">
							<IconUser color="gray" width={30} />
							<Text children="Dimanageri oleh Wahyudi" />
						</Flex>
						<HStack align="start">
							<IconAddressBook color="gray" />
							<Text children="JL Hayam Wuruk No. 108, Taman Sari, West Jakarta" />
						</HStack>
					</Box>
					<Spacer />
					<Box w="full">
						<Text mb="1">Tampilkan nilai dari parameter : </Text>
						<Flex flexWrap="wrap" gap="3">
							<Button size="sm" variant="outline">
								ISPU
							</Button>
							<Button size="sm" variant="outline" isActive>
								CO<sub>2</sub>
							</Button>
							<Button size="sm" variant="outline">
								CH<sub>4</sub>
							</Button>
							<Button size="sm" variant="outline">
								PM<sub>10</sub>
							</Button>
							<Button size="sm" variant="outline">
								PM<sub>25</sub>
							</Button>
						</Flex>
					</Box>
					<HStack justify="end" w="full">
						<Button>Ganti Grup</Button>
						<Button colorScheme="teal">Detai Grup</Button>
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
}
