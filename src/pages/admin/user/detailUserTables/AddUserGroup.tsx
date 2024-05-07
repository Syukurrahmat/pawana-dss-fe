import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, Tag, Avatar, Box, Checkbox, TagLabel, TagCloseButton, HStack, useDisclosure, ButtonProps} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { API_URL } from '@/constants/config';
import axios from 'axios';
import InputSearch from '@/components/form/inputSearch';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';
import { useParams } from 'react-router-dom';
import { mutate } from 'swr';
import NameWithAvatar from '@/components/common/NamewithAvatar';
import { IconBuilding, IconBuildingFactory2 } from '@tabler/icons-react';

const columnHelper = createColumnHelper<searchGroupWithSubsResult>();

const columns = [
	columnHelper.display({
		header: 'Pilih',
		cell: ({ row }) => {
			const { status } = row.original;
			if (status == 'approved' || status == 'pending') {
				return (
					<HStack justifyContent="space-between" px="2">
						<HStack spacing="4">
							<IconBuildingFactory2 />
							<Text>
								{status == 'approved'
									? 'Sudah terdaftar'
									: 'Menunggu persetujuan'}
							</Text>
						</HStack>
						<Text
							fontSize="sm"
							fontStyle="italic"
							children="Sudah terdaftar"
						/>
					</HStack>
				);
			}
			return (
				<Checkbox
					flexDir="row-reverse"
					w="full"
					justifyContent="space-between"
					pr="30px"
					size="lg"
					isChecked={row.getIsSelected()}
					isDisabled={!row.getCanSelect()}
					onChange={row.getToggleSelectedHandler()}
				>
					<HStack spacing="4">
						<IconBuildingFactory2 />
						<Text>{row.original.name}</Text>
					</HStack>
				</Checkbox>
			);
		},
	}),
];

interface IAddGroupModal extends ButtonProps {
	data: any;
}

export default function AddGroupButton({ data, ...rest }: IAddGroupModal) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [searchValue, setSearchValue] = useState('');
	const [isSubmiting, setIsSubmiting] = useState(false);
	const { id: userId } = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const arrayOfrowSelection = Object.keys(rowSelection).map((e) => {
		let xx = e.split('-');
		let groupId = xx.shift();
		return { id: e, groupId, name: xx.join('-') };
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
			.post(`${API_URL}/users/${userId}/groups`, {
				groupIds: arrayOfrowSelection.map((e) =>
					parseInt(e.groupId as string)
				),
			})
			.then(({ data: dt }) => {
				setIsSubmiting(false);
				if (!dt.success) {
					toast({
						title: `Gagal`,
						description: 'Ada yang salah',
						status: 'error',
					});
				} else {
					toast({
						title: `Sukses`,
						description: dt.message,
						status: 'success',
					});
					onClose();
					data.requestGroupCount = 100
					mutate(
						(key) =>
							Array.isArray(key) &&
							key[0] ==
								API_URL +
									'/users/' +
									userId +
									'/groups?not-approved=true'
					);
				}
			});
	};

	return (
		<>
			<Button {...rest} onClick={onOpen}>
				Tambahkan grup
			</Button>

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
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Tambah Grup</ModalHeader>
					<ModalBody>
						<InputSearch
							placeholder="Cari Nama Grup"
							name="search"
							w="100%"
							_onSubmit={setSearchValue}
						/>
						<Box my="2" py="1" px="3" rounded="md" shadow="xs">
							<Box>
								{arrayOfrowSelection.length ? (
									arrayOfrowSelection.map((e) => (
										<Tag mx="1" my="1" size="md" key={e.groupId}>
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
							apiUrl={`${API_URL}/search/groups?is-has-user=${userId}`}
							searchQuery={searchValue}
							columns={columns}
							rowSelection={rowSelection}
							setRowSelection={setRowSelection}
							getRowId={(e: any) => `${e.groupId}-${e.name}`}
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
		</>
	);
}
