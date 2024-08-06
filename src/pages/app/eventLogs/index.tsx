import useUser from '@/hooks/useUser';
import { Box, Flex, HStack, Heading, Text } from '@chakra-ui/react'; //prettier-ignore
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { SelectUserOrCompanyView } from '../dashboards/informationCard';
import CreateEventLog from './CreateEventLog';
import CurrentEventlog from './currentEventlog';
import { EventCalendar } from './EventCalendar';

export default function Notes() {
	const { user } = useUser();
	const companyId = user.view?.company?.companyId;
	if (!companyId) return <SelectUserOrCompanyView />;

	return (
		<Flex gap="3">
			<Box
				flex="1 1 0"
				position="relative"
				h="100%"
				w="full"
				overflowY="auto"
				className="custom-scrollbar"
			>
				<Box position="absolute" pr="3" w="full">
					<HStack justify="space-between">
						<Box>
							<Heading size="lg">Pencatatan</Heading>
							<Text>Catat seluruh kegiatan di pabrik Anda</Text>
						</Box>
						<CreateEventLog />
					</HStack>
					<CurrentEventlog companyId={companyId}/>					
				</Box>
			</Box>

			<Box flex="1 1 0" minH="100%">
				<EventCalendar companyId={companyId} />
			</Box>
		</Flex>
	);
}
