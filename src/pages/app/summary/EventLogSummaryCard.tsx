import {
	eventLogStatusAttr,
	eventLogsTypeAttr,
} from '@/constants/enumVariable';
import { Alert, Box, Card, CardBody, Center, Flex, Grid, HStack, Icon, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import idLocale from '@fullcalendar/core/locales/id';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import { IconCalendarEvent, IconNotebook } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useRef } from 'react';
import { CardEventLog } from '../EventLogs/CardEventLog';
import { eventsMapping, renderEventContent } from '../EventLogs/EventCalendar';

interface EventLogSummaryCard {
	data: SummaryEventLog;
	periode: string;
	dateRange: string[];
}

export function EventLogSummaryCard({
	data,
	periode,
	dateRange,
}: EventLogSummaryCard) {
	const { eventLogs, count : {countStatus, countType, all : countAll}, eventIdLongestEvent: longestEventId,} = data; //prettier-ignore

	const production = countType.find((e) => e.type == 'production');

	return (
		<Card size="sm" shadow="xs">
			<CardBody gap="4" as={Flex}>
				{countAll ? (
					<>
						<Box flex="1 1 0" minH="350px" overflow="hidden">
							<Calendar
								periode={periode}
								data={data}
								dateRange={dateRange}
							/>
						</Box>
						<VStack flex="1 1 0" align="stretch">
							<Alert
								variant="top-accent"
								bg="blue.100"
								p="3"
								roundedTop="sm"
								roundedBottom="md"
								fontSize="md"
								justifyContent="space-between"
							>
								<HStack align="end">
									<Center
										p="2"
										rounded="md"
										bg="blue.200"
										boxSize="50px"
										fontSize="3xl"
										fontWeight="700"
										children={countAll}
									/>
									<Box>
										<Text>Total</Text>
										<Text fontWeight="600">
											Aktivitas di bulan ini
										</Text>
									</Box>
								</HStack>
								<VStack align="start">
									{countStatus.map((e, i) => {
										const { icon, name } =
											eventLogStatusAttr[e.status];

										return (
											<HStack key={i}>
												<Center bg="blue.200" p="1" rounded="md">
													<Icon as={icon} boxSize="20px" />
												</Center>
												<Text>
													{e.count || 'Tidak ada'} aktivitas{' '}
													{name.toLowerCase()}
												</Text>
											</HStack>
										);
									})}
								</VStack>
							</Alert>
							<Text fontWeight="600">Kegiatan Produksi</Text>
							<HStack px="3" justify="space-evenly">
								<HStack>
									<Center
										p="3"
										rounded="md"
										bg="green.100"
										h="50px"
										gap="2"
									>
										<Center bg="green.200" p="2" rounded="md">
											<Icon as={IconNotebook} boxSize="20px" />
										</Center>
										<Text
											fontSize="3xl"
											fontWeight="700"
											children={production?.count || 0}
										/>
										<Text
											fontWeight="600"
											children="Aktivitas produksi"
										/>
									</Center>
								</HStack>
								<HStack>
									<Center
										p="3"
										rounded="md"
										bg="green.100"
										h="50px"
										gap="2"
									>
										<Center bg="green.200" p="2" rounded="md">
											<Icon as={IconCalendarEvent} boxSize="20px" />
										</Center>

										<Text
											fontSize="3xl"
											fontWeight="700"
											children={production?.days || 0}
										/>
										<Text fontWeight="600" children="Hari produksi" />
									</Center>
								</HStack>
							</HStack>
							<Text fontWeight="600">
								Jumlah Aktivitas berdasarkan jenis aktivitas
							</Text>

							<Grid
								justifyContent="center"
								templateColumns="repeat(auto-fit, minmax(160px, 120px))"
								gap="2"
							>
								{countType
									.filter((e) => e.count && e.type !== 'production')
									.map((e) => {
										const { color, icon, name } =
											eventLogsTypeAttr[e.type];

										return (
											<Box
												p="2"
												bg={color + '.100'}
												rounded="md"
												key={e.type}
											>
												<HStack justify="center" spacing="1">
													<Text
														fontSize="2xl"
														fontWeight="600"
														children={e.count}
													/>
													<Icon
														as={icon}
														color={color + '.500'}
														boxSize="23px"
													/>
												</HStack>
												<Text textAlign="center">
													{e.days} Hari {name.toLowerCase()}
												</Text>
											</Box>
										);
									})}
							</Grid>

							{!!longestEventId && (
								<>
									<Text fontWeight="600">Aktivitas terlama</Text>
									<CardEventLog
										event={
											eventLogs.find(
												(e) => e.eventLogId == longestEventId
											)!
										}
									/>
								</>
							)}
						</VStack>
					</>
				) : (
					<Center w="full" py="5">
						<Text fontWeight="600" color="gray.500" fontSize="xl">
							Tidak Ada Catatan Aktivitas
						</Text>
					</Center>
				)}
			</CardBody>
		</Card>
	);
}

function Calendar({ dateRange, periode, data }: EventLogSummaryCard) {
	const [_, endDate] = dateRange;
	const calendarRef = useRef<any>();
	const isIncludeToday = moment(endDate)
		.startOf(periode as any)
		.isSame(moment().startOf(periode as any));

	return (
		<Box h="full">
			<FullCalendar
				firstDay={0}
				ref={calendarRef}
				events={eventsMapping(data.eventLogs)}
				fixedWeekCount={false}
				initialDate={endDate}
				plugins={[dayGridPlugin]}
				initialView="dayGridYear"
				monthStartFormat={{
					month: 'short',
					day: 'numeric',
				}}
				validRange={{
					start: dateRange[0],
					end: isIncludeToday ? moment().toDate() : dateRange[1],
				}}
				locale={idLocale}
				headerToolbar={false}
				eventContent={(e) => renderEventContent(e, true)}
			/>

			<style>
				{`.fc-day.fc-day-disabled {
					border : 0px;
					padding : 0px
					max-height : 0px !important;
				}
				.fc-day.fc-day-disabled *{
					display : none;
					max-height : 0px !important;
					border : 0px
				}
				`}
			</style>
		</Box>
	);
}
