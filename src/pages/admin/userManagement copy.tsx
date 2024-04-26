import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Center, HStack, Heading, Input, Select, Spacer, Text, VStack, IconButton, Tag, Avatar, Skeleton} from '@chakra-ui/react'; // prettier-ignore
import { IconEdit, IconExternalLink, IconPlus, IconTrash, IconUser } from '@tabler/icons-react'; // prettier-ignore
import ResponsivePagination from 'react-responsive-pagination';
import { API_URL } from '@/config';
import { fetcher } from '@/utils/index.utils';
import { useState } from 'react';
import useSWR from 'swr';
import 'react-responsive-pagination/themes/classic.css';

export default function UserMan333agement() {
	const [pageLimit, setPageLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchInput, setSearchInput] = useState('');
	const [sort, setSort] = useState('name');
	const [order, setOrder] = useState('asc');

	const { data, error, isLoading } = useSWR<usersAPIData>(
		`${API_URL}/users?page=${currentPage}&limit=${pageLimit}&search=${searchInput}&sort=${sort}&order${order}`,
		fetcher
	);


	console.log(`${API_URL}/users?page=${currentPage}&limit=${pageLimit}&search=${searchInput}&sort=${sort}&order${order}`)
	const totalPages = data ? Math.ceil(data?.totalItems / pageLimit) : 0;

	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<VStack spacing="6">
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center boxSize="35px" bg="gray.100" rounded="md" p="1">
						<IconUser />
					</Center>
					<Heading fontSize="2xl" fontWeight="600">
						Daftar Pengguna
					</Heading>
				</HStack>
				<Spacer />

				<Select defaultValue="name" w="140px" bg="white" variant="outline">
					<option value="name">Nama</option>
					<option value="email">Email</option>
					<option value="createdAt">Tanggal dibuat</option>
				</Select>

				<Input type="text" w="200px" bg="white" placeholder="Cari .." />
				<Button leftIcon={<IconPlus size="20px" />} colorScheme="green">
					Tambah Pengguna
				</Button>
			</HStack>
			<TableContainer
				shadow="xs"
				bg="white"
				rounded="md"
				className="fixTableHead"
				maxHeight="400px"
				w="full"
			>
				<Table whiteSpace="wrap">
					<Thead>
						<Tr>
							<Th>Nama</Th>
							<Th>Email</Th>
							<Th>Telepon</Th>
							<Th>Peran</Th>
							<Th>Dibuat</Th>
							<Th>Aksi</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading &&
							Array.from({ length: 5 }).map((_, index) => (
								<Tr key={index}>
									<Td colSpan={6}>
										<Skeleton h="2em" w="full" />
									</Td>
								</Tr>
							))}
						{data &&
							data?.success &&
							data?.result.map((row, i) => (
								<Tr key={i}>
									<Td>
										<HStack spacing="4">
											<Avatar name={row.name} size="sm" />
											<Text>{row.name}</Text>
										</HStack>
									</Td>
									<Td>{row.email}</Td>
									<Td>0{row.phone}</Td>
									<Td>
										<Tag>{row.role.toUpperCase()}</Tag>
									</Td>
									<Td>
										{new Date(row.createdAt).toLocaleDateString(
											'id-ID',
											{
												year: 'numeric',
												month: 'short',
												day: '2-digit',
											}
										)}
									</Td>
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
			<ResponsivePagination
				total={totalPages}
				current={currentPage}
				onPageChange={onPageChange}
			/>
		</VStack>
	);
}
