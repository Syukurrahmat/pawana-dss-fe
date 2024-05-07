import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, Tag, Avatar, Box, Checkbox, TagLabel, TagCloseButton, HStack} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { API_URL } from '@/constants/config';
import axios from 'axios';
import InputSearch from '@/components/form/inputSearch';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';
import { useParams } from 'react-router-dom';
import NameWithAvatar from '@/components/common/NamewithAvatar';

const columnHelper = createColumnHelper<searchUserWithSubsResult>();
const columns = [
	columnHelper.display({
		header: 'Pilih',
		cell: ({ row }) =>
			row.original.isInGroup ? (
				<HStack px='2' justifyContent='space-between'>
					<NameWithAvatar name={row.original.name} />

					<Text fontSize="sm" fontStyle="italic">
						Sudah terdaftar
					</Text>
				</HStack>
			) : (
				<Checkbox
					flexDir="row-reverse"
					w="full"
					justifyContent="space-between"
					pr="40px"
					size="lg"
					isChecked={row.getIsSelected()}
					isDisabled={!row.getCanSelect()}
					onChange={row.getToggleSelectedHandler()}
				>
					<NameWithAvatar name={row.original.name} />
				</Checkbox>
			),
	}),
];

interface IAddGroupModal {
	isOpen: boolean;
	onClose: () => void;
}

export default function AddMemberGroup({
	isOpen,
	onClose,
	...rest
}: IAddGroupModal) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [searchValue, setSearchValue] = useState('');
	const [searchResult, setSearchResult] = useState(null);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const { id: groupId } = useParams();
	const toast = useToast();

	const arrayOfrowSelection = Object.keys(rowSelection).map((e) => {
		let xx = e.split('-');
		let userId = xx.shift();
		return { id: e, userId, name: xx.join('-') };
	});

	const submitHandler = async () => {
		setIsSubmiting(true);
		if (!arrayOfrowSelection.length) {
			toast({
				title: `Opss`,
				description: 'Belum ada pengguna yang Anda pilih',
				status: 'warning',
			});
			setIsSubmiting(false);
			return;
		}
		axios
			.post(`${API_URL}/groups/${groupId}/users`, {
				userIds: arrayOfrowSelection.map((e) =>
					parseInt(e.userId as string)
				),
			})
			.then(({ data }) => {
				setIsSubmiting(false);
				if (!data.success) {
					toast({
						title: `Gagal`,
						description: 'Ada yang salah',
						status: 'error',
					});
				} else {
					toast({
						title: `Sukses`,
						description: data.message,
						status: 'success',
					});
					onClose();
				}
			});
	};

	return (
		<Modal
			size="xl"
			autoFocus={false}
			isOpen={isOpen}
			onCloseComplete={() => {
				setRowSelection({});
				setSearchValue('');
			}}
			onClose={onClose}
			closeOnOverlayClick={false}
			{...rest}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Tambah Pelanggan</ModalHeader>
				<ModalBody>
					<InputSearch
						placeholder="Cari Pengguna"
						name="search"
						w="100%"
						_onSubmit={setSearchValue}
					/>
					<Box my="2" py="1" px="3" rounded="md" shadow="xs">
						<Box>
							{arrayOfrowSelection.length ? (
								arrayOfrowSelection.map((e) => (
									<Tag mx="1" my="1" size="md" key={e.userId}>
										<TagLabel>{e.name}</TagLabel>
										<TagCloseButton
											onClick={() =>
												setRowSelection((obj) => {
													let g = { ...obj };
													delete g[e.id as string];
													return g;
												})
											}
										/>
									</Tag>
								))
							) : (
								<Text h="28px">Belum ada grup yang dipilih</Text>
							)}
						</Box>
					</Box>
					<DataTable
						mt="2"
						apiUrl={`${API_URL}/search/users?is-in-group=${groupId}`}
						searchQuery={searchValue}
						columns={columns}
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
						setDataContext={setSearchResult}
						getRowId={(e: any) => `${e.userId}-${e.name}`}
						emptyMsg={['Pengguna tidak ditemukan']}
						maxH="250px"
						withHeader={false}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose}>
						Batal
					</Button>
					<Button
						isLoading={isSubmiting}
						type="submit"
						onClick={submitHandler}
						colorScheme="blue"
						ml={3}
					>
						Submit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
