import { Box, Card, CardBody, CardHeader, CardProps, Center, HStack, Heading, Icon, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconNotebook, IconNotebookOff } from '@tabler/icons-react';

import { CardEventLog } from '../EventLogs/CardEventLog';
import { responsiveCardSize } from '@/utils/common.utils';

interface CurrentEventsCard extends CardProps {
	data: EventLogs[];
}

export function CurrentEventsCard({ data, ...rest }: CurrentEventsCard) {
	
	return (
		<Card size={responsiveCardSize} {...rest}>
			<CardHeader pb="0" as={HStack}>
				<Center
					border="2px solid"
					borderColor={'orange.200'}
					color={'orange.500'}
					rounded="md"
					p="1"
					boxSize="45px"
					children={<Icon as={IconNotebook} boxSize="28px" />}
				/>
				<Box ml='1'>
					<Heading size="md" children={'Kegiatan terkini'} />
					<Tag mt="1">{data.length} Kegiatan Terkini</Tag>
				</Box>
			</CardHeader>
			<CardBody>
				<VStack align="stretch">
					{data.length ? (
						<>
							{data.map((e) => (
								<CardEventLog key={e.eventLogId} event={e as any} />
							))}
						</>
					) : (
						<HStack justify="center" color="gray.500" py="3">
							<IconNotebookOff stroke="1.2" size="40" />
							<Text fontWeight="500" fontSize="lg">
								Tidak ada Kegiatan Berlangsung
							</Text>
						</HStack>
					)}
				</VStack>
			</CardBody>
		</Card>
	);
}

