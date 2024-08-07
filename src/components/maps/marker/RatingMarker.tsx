import { toFormatedDate } from '@/utils/dateFormating';
import { Avatar, Box, Divider, HStack, Heading, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconPhoto } from '@tabler/icons-react';
import { Marker, Popup } from 'react-leaflet'; //prettier-ignore
import { MyMarker } from '.';
import TagWithIcon from '../../common/TagWithIcon';
import { getMarkerEmojiRating } from './IconMarker'; //prettier-ignore

export default function RatingMarker({
	properties,
	...rest
}: MyMarker<ReportData>) {
    
	return (
		<Marker icon={getMarkerEmojiRating(properties.rating)} {...rest}>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack align="start" maxW="200px">
					<HStack>
						<Avatar
							name={properties.creator.name}
							src={properties.creator.profilePicture}
							boxSize="32px"
							size="sm"
						/>
						<Box>
							<Heading size="md" fontSize="lg">
								{properties.creator.name}
							</Heading>
							<Text>{toFormatedDate(properties.createdAt)}</Text>
						</Box>
					</HStack>
					<Divider borderColor="gray.500" />
					<Text fontSize="md">{properties.message}</Text>
					{!!properties.images && !!properties.images.length && (
						<TagWithIcon
							icon={IconPhoto}
							variant="outline"
							colorScheme="orange"
						>
							{properties.images.length} Gambar dilampirkan{' '}
						</TagWithIcon>
					)}
				</VStack>
			</Popup>
		</Marker>
	);
}
