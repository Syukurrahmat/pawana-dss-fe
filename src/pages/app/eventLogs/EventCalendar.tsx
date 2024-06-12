import { Box, Button, Card, CardBody, CardHeader, HStack, Heading, Icon, IconButton, Spacer, Spinner, Text, Tooltip } from '@chakra-ui/react'; //prettier-ignore
import moment from 'moment';
import {
	IconChevronLeft,
	IconChevronRight,
	IconRocket,
} from '@tabler/icons-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { eventLogsTypeAttr } from '@/constants/enumVariable';
import { useRef, useState } from 'react';
import { pageDataFetcher } from '@/utils/fetcher';
import useSWR from 'swr';
import DetailEventLogWrapper from './DetailEventLog';
import useUser from '@/hooks/useUser';

export function EventCalendar() {
	const [currentMonth, setCurrentMonth] = useState(moment());
	const calendarRef = useRef<any>(null);
	const { user } = useUser();

	const { data, isLoading } = useSWR<DTEventLog[]>(
		`/companies/${
			user.activeCompany?.companyId
		}/events?month=${currentMonth.format('YYYY-MM')}`,
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
		<Card h="100%">
			<CardHeader as={HStack} pb="0">
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
			</CardHeader>
			<CardBody>
				<FullCalendar
					// @ts-ignore
					ref={calendarRef}
					events={data ? eventsMapping(data) : []}
					fixedWeekCount={false}
					height="100%"
					initialDate={currentMonth.toDate()}
					plugins={[dayGridPlugin]}
					initialView="dayGridMonth"
					headerToolbar={false}
					eventContent={renderEventContent}
				/>
			</CardBody>
		</Card>
	);
}

function eventsMapping(data: DTEventLog[] = []) {
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

function renderEventContent(eventInfo: any) {
	const { title } = eventInfo.event;
	const { type, eventLogId, status } = eventInfo.event.extendedProps;
	const { icon, color } =
		eventLogsTypeAttr[type] || eventLogsTypeAttr['other'];

	return (
		<DetailEventLogWrapper eventId={eventLogId}>
			<Tooltip label={title} placement="top" hasArrow>
				<HStack
					py="1"
					px="2"
					spacing="1"
					cursor="pointer"
					bg={color + '.500'}
				>
					<Icon as={icon} boxSize="16px" />
					<Text
						fontSize="sm"
						overflow="hidden"
						textOverflow="ellipsis"
						children={title}
					/>
					<Spacer />
					{status == 'inProgress' && (
						<Icon as={IconRocket} boxSize="16px" />
					)}
				</HStack>
			</Tooltip>
		</DetailEventLogWrapper>
	);
}
