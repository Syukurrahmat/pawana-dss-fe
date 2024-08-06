import SectionTitle from '@/components/common/SectionTitle';
import { pageDataFetcher } from '@/utils/fetcher';
import { Box, HStack, Skeleton, Tag, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconChecklist, IconNotebookOff, IconProgress, IconRocket } from '@tabler/icons-react'; //prettier-ignore
import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useSWR from 'swr';
import { CardEventLog } from './CardEventLog';


export default function CurrentEventlog({ companyId }: { companyId: number }) {
	const { data } = useSWR<CurrentEventLogs>(
		companyId ? `/companies/${companyId}/events/current` : null,
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
		<Box>
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
								<HStack justify="center" color="gray.500" py="3">
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
	);
}
