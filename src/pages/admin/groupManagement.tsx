import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Box, Button, Card, CardBody, Center, HStack, Heading, Input, Select, Spacer, Text, VStack, Tag, IconButton} from '@chakra-ui/react'; // prettier-ignore
import { IconDetails, IconEdit, IconExplicit, IconExternalLink, IconPlus, IconTrash, IconUsersGroup } from '@tabler/icons-react';

const data = [{"groupId":1,"name":"Tahu Segar Abadi","address":"Desa Sumber Jaya, Kelurahan Sejahtera, Kecamatan Mekar Indah, Kabupaten Tahu Jaya","subscriptionCount":162},{"groupId":2,"name":"Tahu Sari Murni","address":"Desa Maju Jaya, Kelurahan Bahagia, Kecamatan Rukun Damai, Kabupaten Tahu Indah","subscriptionCount":147},{"groupId":3,"name":"Tahu Rasa Lezat","address":"Desa Karya Indah, Kelurahan Mandiri, Kecamatan Makmur Jaya, Kabupaten Tahu Sejahtera","subscriptionCount":159},{"groupId":4,"name":"Tahu Sehat Berkah","address":"Desa Nusa Jaya, Kelurahan Sejahtera Baru, Kecamatan Maju Mundur, Kabupaten Tahu Berseri","subscriptionCount":156},{"groupId":5,"name":"Tahu Enak Makmur","address":"Desa Makmur Sejahtera, Kelurahan Bahagia Indah, Kecamatan Indah Makmur, Kabupaten Tahu Sejahtera","subscriptionCount":148}] // prettier-ignore

export default function GroupManagement() {
	return (
		<VStack spacing="6">
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center boxSize="35px" bg="gray.100" rounded="md" p="1">
						<IconUsersGroup />
					</Center>
					<Heading fontSize="2xl" fontWeight="600">
						{' '}
						Daftar Grup
					</Heading>
				</HStack>
				<Spacer />
				<Select placeholder="Urutkan" w="100px" bg="white">
					<option value="option1">Option 1</option>
					<option value="option2">Option 2</option>
					<option value="option3">Option 3</option>
				</Select>
				<Input type="text" w="200px" bg="white" placeholder="Cari .." />
				<Button leftIcon={<IconPlus size="20px" />} colorScheme="green">
					Tambah Grup
				</Button>
			</HStack>
			<TableContainer
				shadow="xs"
				bg="white"
				rounded="md"
				className="fixTableHead"
				maxHeight="500px"
			>
				<Table whiteSpace="wrap">
					<Thead>
						<Tr>
							<Th>Nama</Th>
							<Th>Alamat</Th>
							<Th textAlign="center">Jumlah Pelanggan</Th>
							<Th textAlign="center">Aksi</Th>
						</Tr>
					</Thead>
					<Tbody>
						{data.map((e, i) => (
							<Tr key={i}>
								<Td>{e.name}</Td>
								<Td>
									<Text noOfLines={2}>{e.address}</Text>
								</Td>
								<Td textAlign="center">{e.subscriptionCount}</Td>
								<Td>
									<HStack>
										<IconButton
											aria-label="Detail"
											icon={<IconExternalLink size="16" />}
											colorScheme="blue"
											size="sm"
										/>
										<IconButton
											aria-label="Sunting"
											icon={<IconEdit size="16" />}
											colorScheme="yellow"
											size="sm"
										/>
										<IconButton
											aria-label="Hapus"
											icon={<IconTrash size="16" />}
											colorScheme="red"
											size="sm"
										/>
									</HStack>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</VStack>
	);
}
