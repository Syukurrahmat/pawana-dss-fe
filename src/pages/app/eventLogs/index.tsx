import { Skeleton, Box, Flex, HStack, Heading, Text, VStack, Tag, Center, Icon } from '@chakra-ui/react'; //prettier-ignore
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
	IconChecklist,
	IconCircleX,
	IconClipboardX,
	IconNotebookOff,
	IconProgress,
	IconRocket,
	IconSquareX,
} from '@tabler/icons-react';
import SectionTitle from '@/components/common/SectionTitle';
import { EventCalendar } from './EventCalendar';
import { CardEventLog } from './CardEventLog';
import useSWR from 'swr';
import { pageDataFetcher } from '@/utils/fetcher';
import CreateEventLog from './CreateEventLog';
import React from 'react';
import useUser from '@/hooks/useUser';

export default function Notes() {
	const { user } = useUser();

	let { data, isLoading } = useSWR<CurrentEventLogs>(
		`/companies/${user.activeCompany?.companyId}/events/current`,
		pageDataFetcher
	);

	const sections = [
		{
			title: 'Kegiatan Berlangsung',
			icon: IconRocket,
			count: data?.inProgress.count,
			events: data?.inProgress.events,
		},
		{
			title: 'Kegiatan Mendatang',
			icon: IconProgress,
			count: data?.upcoming.count,
			events: data?.upcoming.events,
		},
		{
			title: 'Kegiatan Selesai',
			icon: IconChecklist,
			count: data?.complete.count,
			events: data?.complete.events,
			more: true,
		},
	];

	return (
		<Flex gap="4">
			<Box
				flex="1 1 0"
				position="relative"
				h="100%"
				w="full"
				overflowY="auto"
			>
				<Box position="absolute" pr="3" w="full">
					<HStack justify="space-between">
						<Box>
							<Heading size="lg">Pencatatan</Heading>
							<Text>Catat seluaruh kegiatan di pabrik Anda</Text>
						</Box>
						<CreateEventLog />
					</HStack>

					{sections.map(({ title, icon, count, events, more }, i) => (
						<React.Fragment key={i}>
							<SectionTitle IconEl={icon}>
								{title}
								{!!count && (
									<Tag children={count} ml="2" colorScheme="blue" />
								)}
							</SectionTitle>

							<VStack align="stretch">
								{events ? (
									events.length ? (
										<>
											{events.map((e) => (
												<CardEventLog
													key={e.eventLogId}
													event={e as any}
												/>
											))}
											
											{more && !!count && (
												<Text mx="auto">
													Dan {count - events.length} kegiatan
													terselesaikan lainnya
												</Text>
											)}
										</>
									) : (
										<HStack justify="center" color="gray.500" py='3'>
											<IconNotebookOff stroke="1.2" size="40" />
											<Text fontWeight="500" fontSize="lg">
												Tidak ada {title}
											</Text>
										</HStack>
									)
								) : (
									Array(3)
										.fill(null)
										.map((_, i) => (
											<Skeleton key={i} h="60.38px" w="full" />
										))
								)}
							</VStack>
						</React.Fragment>
					))}
				</Box>
			</Box>

			<Box flex="1 1 0" minH="100%">
				<EventCalendar />
			</Box>
		</Flex>
	);
}
