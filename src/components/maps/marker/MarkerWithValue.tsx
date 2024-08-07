import { toFormatedDatetime } from '@/utils/dateFormating';
import { HStack, Spacer, Tag, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { CircleMarker, Popup, Tooltip } from 'react-leaflet'; //prettier-ignore
import { MyMarker } from './';

type ValueNodeMarker = NodeData & {
	data: {
		value: number;
		datetime: string;
		color: string;
		name: string;
	};
};

export default function ValueMarker(props: MyMarker<ValueNodeMarker>) {
	const { properties, ...rest } = props;
	const { data, name } = properties;

	return (
		<CircleMarker
			center={rest.position}
			pathOptions={{
				color: `var(--chakra-colors-${data?.color || 'gray'}-500)`,
				weight: 2.2,
			}}
			radius={18}
			{...rest}
		>
			<Popup className="map-popup" offset={[0, -16]}>
				<VStack spacing="1" align="end">
					{data ? (
						(() => {
							const { value, datetime, name: dataName, color } = data;

							return (
								<>
									<HStack>
										<Text
											fontWeight="600"
											fontSize="md"
											children={name}
										/>
										<Spacer />
										{value !== undefined && (
											<>
												<Tag children={dataName} />
												<Tag
													colorScheme={color || 'gray'}
													children={value}
												/>
											</>
										)}
									</HStack>
									{!!datetime && (
										<Text>
											Diperbarui pada {toFormatedDatetime(datetime)}
										</Text>
									)}
									{value === undefined && (
										<Text alignSelf="start">Tidak Ada Data</Text>
									)}
								</>
							);
						})()
					) : (
						<Text>Node tidak uptodate</Text>
					)}
				</VStack>
			</Popup>

			<Tooltip
				className="tooltip-display-value"
				direction="center"
				children={
					<Text stroke="1px red">{formatNumber(data?.value) || '??'}</Text>
				}
				permanent
			/>
		</CircleMarker>
	);
}

function formatNumber(number: any) {
	return typeof number !== 'number'
		? ''
		: number % 1
		? number.toFixed(1)
		: number.toString();
}
