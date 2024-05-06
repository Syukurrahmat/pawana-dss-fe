import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, Tag, Avatar, Box, Checkbox, TagLabel, TagCloseButton, HStack, useDisclosure, InputProps, ButtonProps, Radio} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { API_URL } from '@/constants/config';
import axios from 'axios';
import InputSearch from '@/components/form/inputSearch';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';
import { useParams } from 'react-router-dom';
import {
	IconBuildingFactory,
	IconBuildingFactory2,
	IconChevronDown,
} from '@tabler/icons-react';

const columnHelper = createColumnHelper<searchGroupWithSubsResult>();

const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => (
			<HStack w="full" justifyContent="left">
				<IconBuildingFactory2 />
				<Text>{info.getValue()}</Text>
			</HStack>
		),
	}),
	columnHelper.display({
		header: 'Pilih',
		cell: ({ row, table }) => (
			<Radio
				size="lg"
				bg="white"
				isChecked={row.getIsSelected()}
				isDisabled={!row.getCanSelect()}
				onChange={() => {
					table.resetRowSelection();
					row.toggleSelected();
				}}
			/>
		),
	}),
];

interface ISetGroupInput extends ButtonProps {
	onChange: (e: any) => any;
}

export default function SelectGroupInput({
	onChange,
	...rest
}: ISetGroupInput) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [searchValue, setSearchValue] = useState('');

	const toast = useToast();

	const selectedGroup = Object.keys(rowSelection).map((e) => {
		let xx = e.split('-');
		let groupId = xx.shift();
		return { id: e, groupId, name: xx.join('-') };
	})[0]

	const submitHandler = async () => {
		if (!selectedGroup) {
			toast({
				title: `Opss`,
				description: 'Belum ada pengguna yang Anda pilih',
				status: 'warning',
			});

			return;
		}
		onChange(selectedGroup);
		onClose();
	};

	return (
		<>
			<Button
				p="4"
				size="lg"
				fontSize="md"
				shadow="xs"
				rounded="md"
				bg="white"
				color="gray.500"
				variant="outline"
				rightIcon={<IconChevronDown size="20" />}
				
				leftIcon={<IconBuildingFactory2 size='20' />}
				onClick={onOpen}
				{...rest}
			>
				<Text textTransform="uppercase">{selectedGroup?.name || "Pilih Grup"}</Text>
			</Button>
			<Modal
				size="xl"
				autoFocus={false}
				isOpen={isOpen}
				onClose={onClose}
				closeOnOverlayClick={false}
				onCloseComplete={() => {
					setSearchValue('');
				}}
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

						{Boolean(searchValue) && (
							<DataTable
								mt="2"
								apiUrl={`${API_URL}/search/groups`}
								searchQuery={searchValue}
								columns={columns}
								rowSelection={rowSelection}
								setRowSelection={setRowSelection}
								getRowId={(e: any) => `${e.groupId}-${e.name}`}
								emptyMsg={['Pengguna tidak ditemukan']}
								maxH="250px"
								withHeader={false}
							/>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" onClick={onClose}>
							Batal
						</Button>
						<Button
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
