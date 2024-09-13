import { toFormatedDatetime } from '@/utils/dateFormating';
import { Divider, HStack, Heading, Spacer, Tag, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { Marker, Popup } from 'react-leaflet'; //prettier-ignore
import { TagCompanyType, TagNodeStatus } from '../../Tags/index.tags';
import { getCompanyMarker } from './IconMarker'; //prettier-ignore

export default function CompanyMarker({ properties, ...rest }: any) {
	const { name, type, indoorNodeValue, indoorNodes } = properties;

	return (
		<Marker icon={getCompanyMarker(type)} {...rest}>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack align="start" spacing="1">
					<Text fontSize="sm">Lokasi Perusahaan</Text>
					<Heading size="sm">{name}</Heading>
					{indoorNodeValue ? (
						<>
							<Divider />
							<VStack>
								{indoorNodeValue.map((e: any, i: number) => (
									<VStack key={i} align="start" w="full" spacing="1">
										<HStack w='full'>
											<Text
												fontWeight="600"
												fontSize="md"
												children={e.name}
											/>
											<Spacer />
											<Tag children={e.data?.name} />
											<Tag
												colorScheme={e.data?.color || 'gray'}
												children={e.data?.value || '??'}
											/>
										</HStack>
										{!!e.data?.datetime && (
											<Text>
												Diperbarui pada{' '}
												{toFormatedDatetime(e.data?.datetime)}
											</Text>
										)}
									</VStack>
								))}
							</VStack>
						</>
					) : indoorNodes ? (
						<>
							<Divider my="2px" />

							<VStack align="stretch">
								{indoorNodes.map((e: any, i: number) => (
									<VStack key={i} spacing="1" align="start">
										<HStack w="full">
											<Text
												fontWeight="600"
												fontSize="md"
												children={e.name}
											/>
											<Spacer />
											<TagNodeStatus
												value={e.isUptodate}
												size="sm"
											/>
										</HStack>

										<Text
											children={
												e.lastDataSent
													? `Diperbarui pada ${toFormatedDatetime(
															e.lastDataSent
													  )}`
													: 'Belum pernah mengirim data'
											}
										/>
									</VStack>
								))}
							</VStack>
						</>
					) : (
						<TagCompanyType value={type} />
					)}
				</VStack>
			</Popup>
		</Marker>
	);
}
