import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, HStack, useDisclosure, ButtonProps, Radio, VStack, Box} from '@chakra-ui/react'; //prettier-ignore
import { useMemo, useState } from 'react';
import InputSearch from '@/components/form/inputSearch';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';
import { IconChevronDown } from '@tabler/icons-react';

const columnHelper = createColumnHelper<searchGroupWithSubsResult>();

interface ISelectGroup extends ButtonProps {
	placeholder: string;
	Icon: any;
	itemName: string;
	itemIdKey: string;
	apiUrl: string;
	externalState?: [
		RowSelectionState,
		React.Dispatch<React.SetStateAction<RowSelectionState>>
	];
	onChange?: (e: any) => any;
}

export default function SelectGroup({
	onChange,
	placeholder,
	Icon,
	itemIdKey,
	itemName,
	apiUrl,
	externalState,
	...rest
}: ISelectGroup) {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchValue, setSearchValue] = useState('');
	const [rowSelection, setRowSelection] =
		externalState || useState<RowSelectionState>({});

	const selectedGroup = Object.keys(rowSelection).map((e) => {
		let xx = e.split('-');
		let itemId = xx.shift();
		return { id: e, [itemIdKey]: itemId, name: xx.join('-') };
	})[0];

	const submitHandler = async () => {
		if (!selectedGroup) {
			toast({
				title: `Opss`,
				description: `Belum ada ${itemName} yang dipilih`,
				status: 'warning',
			});
			return;
		}

		if (onChange) onChange(selectedGroup);
		onClose();
	};

	const columns = useMemo(
		() => [
			columnHelper.display({
				header: 'Pilih',
				cell: ({ row }) => (
					<Radio
						flexDir="row-reverse"
						w="full"
						justifyContent="space-between"
						pr="30px"
						size="lg"
						bg="white"
						isChecked={row.getIsSelected()}
						isDisabled={!row.getCanSelect()}
						onChange={row.getToggleSelectedHandler()}
					>
						<HStack>
							<Icon />
							<Text>{row.original.name}</Text>
						</HStack>
					</Radio>
				),
			}),
		],
		[]
	);

	return (
		<>
			<Button
				py="8"
				size="lg"
				fontSize="md"
				shadow="xs"
				border="0px solid"
				bg="gray.50"
				colorScheme="blue"
				variant="outline"
				rightIcon={<IconChevronDown size="20" />}
				leftIcon={<Icon size="28" />}
				onClick={onOpen}
				{...rest}
			>
				<VStack spacing="1" align="start" px="1">
					<Text textTransform="capitalize" fontSize="sm" color="gray.500">
						{itemName}
					</Text>
					<Text textTransform="uppercase">
						{selectedGroup?.name || placeholder}
					</Text>
				</VStack>
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
					<ModalHeader>{placeholder}</ModalHeader>
					<ModalBody>
						<InputSearch
							placeholder={'Cari Nama ' + itemName}
							name="search"
							w="100%"
							_onSubmit={setSearchValue}
						/>

						<DataTable
							mt="5"
							maxH="250px"
							columns={columns}
							withHeader={false}
							apiUrl={apiUrl}
							searchQuery={searchValue}
							emptyMsg={[`${itemName} tidak ditemukan`]}
							rowSelection={rowSelection}
							setRowSelection={setRowSelection}
							enableMultiRowSelection={false}
							getRowId={(e: any) => `${e[itemIdKey]}-${e.name}`}
						/>
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
							children="Pilih"
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
