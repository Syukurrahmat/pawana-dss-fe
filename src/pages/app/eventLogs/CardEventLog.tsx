import { eventLogsTypeAttr } from '@/constants/enumVariable';
import { toFormatedDate } from '@/utils/dateFormating';
import { Alert, AlertTitle, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCalendar, IconHourglass } from '@tabler/icons-react';
import DetailEventLogTriger from './DetailEventLog';

interface CardEventLog {
	event: DTEventLog;
}

export function CardEventLog({ event }: CardEventLog) {
	const color = eventLogsTypeAttr[event.type]?.color || 'gray';

	return (
		<Alert variant="left-accent" colorScheme={color} rounded="sm">
			<HStack justify="space-between" w="full">
				<VStack spacing='1' align='start'>
					<AlertTitle fontWeight="600" children={event.name} />

					<HStack fontSize="sm" >
						<Icon as={IconCalendar} boxSize="16px" />
						<Text>
							{toFormatedDate(event.startDate)}
							{event.startDate !== event.endDate &&
								' - ' + (toFormatedDate(event.endDate) || 'Selesai')}
						</Text>
						{/* {event.duration > 0 && <Text>{event.duration} hari</Text>} */}
					</HStack>
					{event.duration > 0 && (
						<HStack fontSize="sm">
							<Icon as={IconHourglass} boxSize="16px" />
							<Text>
								Durasi : {event.duration} Hari
							</Text>
						</HStack>
					)}
				</VStack>
				<DetailEventLogTriger eventId={event.eventLogId}>
					<Button size="sm" colorScheme="blue" children="Lihat Detail" />
				</DetailEventLogTriger>
			</HStack>
		</Alert>
	);
}
