import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, Flex, HStack, Tag, Text, VStack} from '@chakra-ui/react'; // prettier-ignore
import { IconCircle, IconTrees } from '@tabler/icons-react';

// const colorConversion = {
// 	Baik: 'green',
// 	Sedang: 'blue',
// 	'Tidak Sehat': 'yellow',
// 	'Sangat Tidak Sehat': 'red',
// 	Berbahaya: 'gray',
// };

interface MNISPUCardProps {
	title: string;
	// data: MultipleNodeDataType;
}

export default function MutipleNodeISPUCard({ title,  }: MNISPUCardProps) {
	// const {average} = data.ispu


	return (
		<VStack spacing="4" align="start" w="50%">
			<HStack align="center">
				<IconTrees width="28px" />
				<Text fontWeight="600">{title}</Text>
			</HStack>

			{/* Header */}
			<Flex gap="4" h="105px" w="full" justifyContent="stretch">
				<VStack
					spacing="0"
					rounded="md"
					align="start"
					bg="green.100"
					py="2"
					px="4"
					flexGrow={3}
					justify="center"
				>
					<Text>Rerata</Text>
					<Text fontSize="xl" fontWeight={600}>
						300
					</Text>
					<Tag>Aman</Tag>
				</VStack>
				<VStack
					spacing="0"
					rounded="md"
					align="start"
					bg="green.100"
					py="2"
					px="4"
					flexGrow={1}
					justify="center"
				>
					<Text>Minimal</Text>
					<HStack w="full" justify="space-between">
						<Text fontSize="xl" fontWeight={600}>
							300
						</Text>
						<Tag>Aman</Tag>
					</HStack>
					<HStack>
						<IconCircle width="12px" />
						<Text fontSize="sm">Belakang Pabrik </Text>
					</HStack>
				</VStack>
				<VStack
					spacing="0"
					rounded="md"
					align="start"
					bg="green.100"
					py="2"
					px="4"
					flexGrow={1}
					justify="center"
				>
					<Text>Maksimal</Text>
					<HStack w="full" justify="space-between">
						<Text fontSize="xl" fontWeight={600}>
							300
						</Text>
						<Tag>Aman</Tag>
					</HStack>
					<HStack>
						<IconCircle width="12px" />
						<Text fontSize="sm">Belakang Pabrik </Text>
					</HStack>
				</VStack>
			</Flex>
			<Text fontWeight="600">Kualitas Udara Per Node</Text>
			<TableContainer>
				<Table variant="striped">
					<Thead>
						<Tr>
							<Th>Node</Th>
							<Th>ISPU PM2.5</Th>
							<Th>ISPU PM10</Th>
							<Th>Detail</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td>inches</Td>
							<Td>millimetres (mm)</Td>
							<Td>25.4</Td>
						</Tr>
						<Tr>
							<Td>feet</Td>
							<Td>centimetres (cm)</Td>
							<Td>30.48</Td>
						</Tr>
						<Tr>
							<Td>yards</Td>
							<Td>metres (m)</Td>
							<Td>0.91444</Td>
						</Tr>
					</Tbody>
					<Tfoot>
						<Tr>
							<Th>To convert</Th>
							<Th>into</Th>
							<Th>multiply by</Th>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
		</VStack>
	);
}
