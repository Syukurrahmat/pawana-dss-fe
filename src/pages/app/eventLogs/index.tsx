import useUser from '@/hooks/useUser';
import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react'; //prettier-ignore

import { SelectUserOrCompanyView } from '@/components/common/AdminInforCard';
import CreateEventLog from './CreateEventLog';
import CurrentEventlog from './currentEventlog';
import { EventCalendar } from './EventCalendar';

export default function Notes() {
	const { user, screenType } = useUser();
	const companyId = user.view?.company?.companyId;
	if (!companyId) return <SelectUserOrCompanyView selectCompanyOnly />;

	const Header = (
		<HStack justify="end" spacing="4" wrap="wrap" mb="8px">
			<Box flex="1 0 0">
				<Heading size="lg">Pencatatan</Heading>
				<Text color="dimmed">Catat seluruh kegiatan di pabrik Anda</Text>
			</Box>
			<CreateEventLog />
		</HStack>
	);

	const CurrentEvent = <CurrentEventlog companyId={companyId} />;

	return (
		<Flex direction={screenType == 'desktop' ? 'row' : 'column'} gap="3">
			{screenType == 'desktop' && (
				<Box
					flex="1 1 0"
					position="relative"
					overflowY="auto"
					className="custom-scrollbar"
				>
					<Box position="absolute" pr="3" w="full">
						{Header}
						{CurrentEvent}
					</Box>
				</Box>
			)}

			{screenType !== 'desktop' && Header}

			<Box
				flex={{ base: undefined, lg: '1 1 0' }}
				h={{ base: '400px', lg: 'auto' }}
			>
				<EventCalendar companyId={companyId} />
			</Box>
			{screenType !== 'desktop' && CurrentEvent}
		</Flex>
	);
}
