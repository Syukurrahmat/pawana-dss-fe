import { Box, Button, Card, CardBody, Flex, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'; // prettier-ignore
import { IconAddressBook, IconUser } from '@tabler/icons-react';
import { LatLngTuple, latLngBounds } from 'leaflet';
import MyMap, { getBonds } from '@/components/maps/index.maps';

 
export default function GroupInfoDash() {
	const nodes: LatLngTuple[] = [
		[-7.3707116, 110.8910556],
		[-7.3717116, 110.8920556],
		[-7.3701116, 110.8930556],
	];

	return (
		<Card size="sm" w="full">
			<CardBody as={Flex} gap="1em">
				<MyMap nodes={nodes}/>
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
