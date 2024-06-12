import { Alert, AlertTitle, Box, Button, HStack, Text } from '@chakra-ui/react'; // prettier-ignore
import { eventLogsTypeAttr } from '@/constants/enumVariable';
import DetailEventLogWrapper from './DetailEventLog';
import { toFormatedDate } from '@/utils/dateFormating';

interface CardEventLog {
	event: DTEventLog;
}

export function CardEventLog({ event }: CardEventLog) {
	const color = eventLogsTypeAttr[event.type]?.color || 'gray'

	return (
		<Alert variant="left-accent" colorScheme={color} rounded="md">
			<HStack justify="space-between" w="full">
				<Box>
					<AlertTitle fontWeight="600" children={event.name} />
					<Text fontSize="sm">
						{toFormatedDate(event.startDate)}
						{event.startDate !== event.endDate &&
							' - ' + (toFormatedDate(event.endDate) || 'Selesai')}
					</Text>
				</Box>
				<DetailEventLogWrapper eventId={event.eventLogId}>
					<Button size="sm" colorScheme="blue" children="Lihat Detail" />
				</DetailEventLogWrapper>
			</HStack>
		</Alert>
	);
}
