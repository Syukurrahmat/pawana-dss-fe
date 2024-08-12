import { Box, Card, CardBody, CardHeader, CardProps, Center, HStack, Heading, Icon, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconNotebookOff, IconSpeakerphone } from '@tabler/icons-react';
import ReportCard from '../Reports/ReportCard';

interface NearReport extends CardProps {
	data: any[];
}

export function NearReport({ data, ...rest }: NearReport) {
	return (
		<Card {...rest}>
			<CardHeader pb="0" as={HStack}>
				<Center
					border="2px solid"
					borderColor={'yellow.200'}
					color={'yellow.500'}
					rounded="md"
					p="1"
					boxSize="45px"
					children={<Icon as={IconSpeakerphone} boxSize="28px" />}
				/>
				<Box ml='1'>
					<Heading size="md" children='Aduan terkini' />
					<Tag mt="1">{data.length} Aduan terkini</Tag>
				</Box>
			</CardHeader>
			<CardBody >
				<Text mb="4">
					Aduan dalam radius 250 meter dari lokasi usaha Anda dalam
					24 jam terakhir
				</Text>
				<VStack align="stretch">
					{data.length ? (
						data.map((e) => <ReportCard border='1px solid' rounded='lg' borderColor='gray.200' size='sm'  data={e} key={e.reportId} />)
					) : (
						<HStack justify="center" color="gray.500" py="3">
							<IconNotebookOff stroke="1.2" size="40" />
							<Text fontWeight="500" fontSize="lg">
								Tidak ada Aduan di sekitar
							</Text>
						</HStack>
					)}
				</VStack>
			</CardBody>
		</Card>
	);
}
