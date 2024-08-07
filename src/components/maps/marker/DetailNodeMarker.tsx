import { toFormatedDatetime } from '@/utils/dateFormating';
import { HStack, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { Marker, Popup } from 'react-leaflet'; //prettier-ignore
import { TagNodeStatus } from '../../Tags/index.tags';
import { getNodesMarker } from './IconMarker'; //prettier-ignore
import { MyMarker } from '.';

export default function DetailNodesMarker({
	properties,
	...rest
}: MyMarker<NodeData>) {
	return (
		<Marker
			icon={getNodesMarker(properties.owner ? 'indoor' : 'outdoor')}
			{...rest}
		>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack align="start">
					<Text fontSize="lg" fontWeight="600" textTransform="capitalize">
						{properties.name}
					</Text>
					<TagNodeStatus value={properties.isUptodate} size="sm" />
					{!!properties.lastDataSent && (
						<HStack spacing="1">
							<Text fontWeight="600">Data diperbarui pada : </Text>
							<Text>{toFormatedDatetime(properties.lastDataSent)}</Text>
						</HStack>
					)}
				</VStack>
			</Popup>
		</Marker>
	);
}
