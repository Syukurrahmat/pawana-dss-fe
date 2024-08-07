import { Button, HStack, Heading, Tag, TagLabel, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRef } from 'react';
import { Marker, Popup } from 'react-leaflet'; //prettier-ignore
import { TagNodeStatus } from '../../Tags/index.tags';
import { getSubscriptionMarkers } from './IconMarker'; //prettier-ignore
import { MyMarker } from '.';

type SelectedNode = { nodeId: number; name: string };
type MarkerSubs = (selectedValue: SelectedNode[], onChange: (dt: SelectedNode) => any ) => any; //prettier-ignore

export const generateNodesMarkerForNodeSubs: MarkerSubs = (selectedValue,onChange) => {

    function NodesMarkerWithSubs({ properties, ...rest }: MyMarker<NodeData>) {
		const markerReff = useRef<any>();

		const { nodeId } = properties;
		const isChecked = Boolean(selectedValue.find((e) => e.nodeId == nodeId));

		const onClickHandler = () => {
			markerReff.current?.closePopup();

			setTimeout(() => {
				const { name, nodeId } = properties;
				onChange({ name, nodeId });
			}, 300);
		};

		return (
			<Marker
				icon={getSubscriptionMarkers(
					properties.isSubscribed
						? 'subscribed'
						: isChecked
						? 'selected'
						: 'unselected'
				)}
				ref={markerReff}
				{...rest}
			>
				<Popup className="map-popup" offset={[0, -16]}>
					<VStack align="start" spacing="1">
						<Heading size="sm" textTransform="capitalize">
							{properties.name}
						</Heading>
						<HStack mb="2">
							<TagNodeStatus value={properties.isUptodate} />
						</HStack>

						{properties.isSubscribed ? (
							<Tag variant="outline" w="full">
								<TagLabel
									w="full"
									textAlign="center"
									children="Sudah diikuti"
								/>
							</Tag>
						) : isChecked ? (
							<Button
								leftIcon={<IconX size="14" />}
								colorScheme="red"
								size="xs"
								w="full"
								onClick={onClickHandler}
								children="Batal Pilih"
							/>
						) : (
							<Button
								leftIcon={<IconCheck size="14" />}
								colorScheme="blue"
								size="xs"
								w="full"
								onClick={onClickHandler}
								children="Pilih Node"
							/>
						)}
					</VStack>
				</Popup>
			</Marker>
		);
	}

	return NodesMarkerWithSubs;
};
