import {
	Text,
	Card,
	CardBody,
	CardHeader,
	HStack,
	Spacer,
	VStack,
	Heading,
	Tag,
	TableContainer,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Alert,
    Button,
} from '@chakra-ui/react';
import { IconArrowBarRight, IconBuildingFactory, IconHistory, IconMoodHappy } from '@tabler/icons-react';

export default function ISPUCard() {
	return (
		<Card overflow='hidden'>
			<CardHeader as={HStack} bg="red.100" spacing="4">
				<VStack
					rounded="lg"
					align="start"
					w="100px"
					h="100px"
					p="4"
					bg="red.200"
				>
					<Text fontStyle="italic">ISPU</Text>
					<Spacer />
					<Text fontSize="4xl" fontWeight="700">
						300
					</Text>
				</VStack>

				<VStack align="start" spacing="0">
					<HStack color="gray.600" fontWeight="600">
						<IconBuildingFactory width="1.2em" />
						<Text>Kualitas Udara dalam Pabrik</Text>
					</HStack>
					<Heading as="p" size="lg">
						Normal
					</Heading>
					<Tag mt="1.5">Polutan Utama : PM10</Tag>
				</VStack>
				<Spacer />
				<IconMoodHappy
					size="85"
					strokeWidth="1.5px"
					color="var(--chakra-colors-red-400)"
				/>
			</CardHeader>

			<CardBody>
				<TableContainer >
					<Table variant="striped">
						<Thead>
							<Tr>
								<Th p="3">Parameter</Th>
								<Th p="3">Nilai</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Tr>
								<Td p="3">PM10</Td>
								<Td p="3">23 µg/m³</Td>
							</Tr>
							<Tr>
								<Td p="3">PM2.5</Td>
								<Td p="3">1 µg/m³</Td>
							</Tr>
						</Tbody>
					</Table>
				</TableContainer>
				<Alert my='4' rounded="sm" status="warning" variant="left-accent">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
					maiores aliquam commodi aut animi pariatur rem eos quos at
					fugiat!
				</Alert>
				<HStack mt="3" justify="space-between">
					<HStack fontSize="sm" color="gray.600">
						<IconHistory width="18px" />
						<Text>Diperbarui 1 menit yang lalu</Text>
					</HStack>
					<Button
						size="sm"
						leftIcon={<IconArrowBarRight width="20px" />}
						colorScheme="teal"
						children="Detail"
					/>
				</HStack>
			</CardBody>
		</Card>
	);
}
