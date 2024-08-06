import { eventLogsTypeAttr } from '@/constants/enumVariable';
import { pageDataFetcher } from '@/utils/fetcher';
import { Alert, Box, Button, HStack, Heading, Icon, IconButton, Spacer, Spinner, Text, Tooltip, VStack } from '@chakra-ui/react'; //prettier-ignore
import { EventContentArg } from '@fullcalendar/core/index.js';
import idLocale from '@fullcalendar/core/locales/id';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import {
	IconChevronLeft,
	IconChevronRight,
	IconRocket,
} from '@tabler/icons-react';
import moment from 'moment';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import DetailEventLogTriger from './DetailEventLog';

export function EventCalendar({ companyId }: { companyId: number }) {
	const [currentMonth, setCurrentMonth] = useState(moment());
	const calendarRef = useRef<any>(null);
	
	const { data, isLoading } = useSWR<DTEventLog[]>(
		`/companies/${companyId}/events?month=${currentMonth.format('YYYY-MM')}`,
		pageDataFetcher,
		{ keepPreviousData: true }
	);

	const navDatehandle = (e: string) => {
		const calendarApi = calendarRef.current?.getApi();
		if (calendarApi) {
			calendarApi[e]();
			setCurrentMonth(moment(calendarApi.getDate()));
		}
	};

	return (
		<Alert
			h="100%"
			shadow="xs"
			variant="top-accent"
			fontSize="md"
			rounded="sm"
			as={VStack}
			bg="white"
		>
			<HStack w="full" py="1">
				<HStack spacing="4">
					<Heading size="md" children={currentMonth.format('MMM YYYY')} />
					{isLoading && (
						<Spinner
							emptyColor="gray.200"
							color="blue.500"
							boxSize="18px"
						/>
					)}
				</HStack>
				<Spacer />
				<IconButton
					icon={<IconChevronLeft />}
					aria-label="previous"
					onClick={() => navDatehandle('prev')}
				/>
				<IconButton
					icon={<IconChevronRight />}
					aria-label="next"
					onClick={() => navDatehandle('next')}
				/>
				<Button onClick={() => navDatehandle('today')}>Bulan ini</Button>
			</HStack>
			<Box w="full" h="full">
				<FullCalendar
					ref={calendarRef}
					events={data ? eventsMapping(data) : []}
					fixedWeekCount={false}
					height="100%"
					initialDate={currentMonth.toDate()}
					plugins={[dayGridPlugin]}
					headerToolbar={false}
					locale={idLocale}
					initialView="dayGridMonth"
					eventContent={(e)=>renderEventContent(e)}
				/>
			</Box>
		</Alert>
	);
}

export function eventsMapping(data: DTEventLog[] = []) {
	return data.map(({ startDate, endDate, name, ...e }) => ({
		...e,
		start: startDate,
		end:
			e.status == 'inProgress' && !endDate
				? moment().add(1, 'd').format('YYYY-MM-DD')
				: endDate
				? moment(endDate).add(1, 'd').format('YYYY-MM-DD')
				: undefined,
		title: name,
		className: 'event-item',
	}));
}

export function renderEventContent(
	eventInfo: EventContentArg,
	readOnly = false
) {
	const { title } = eventInfo.event;
	const { type, eventLogId, status } = eventInfo.event.extendedProps;
	const { icon, color } =
		eventLogsTypeAttr[type] || eventLogsTypeAttr['other'];

	return (
		<DetailEventLogTriger eventId={eventLogId} readOnly={readOnly}>
			<Tooltip label={title} placement="top" hasArrow>
				<HStack p="1" spacing="1" cursor="pointer" bg={color + '.500'}>
					<Icon as={icon} boxSize="16px" />
					<Text
						fontSize="sm"
						overflow="hidden"
						textOverflow="ellipsis"
						children={title }
					/>
					<Spacer />
					{status == 'inProgress' && (
						<Icon as={IconRocket} boxSize="16px" />
					)}
				</HStack>
			</Tooltip>
		</DetailEventLogTriger>
	);
}
