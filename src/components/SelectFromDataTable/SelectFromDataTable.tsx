import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import { Box, Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Text, useDisclosure, useToast } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronDown } from '@tabler/icons-react';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const columnHelper = createColumnHelper<searchGroupWithSubsResult>();

export interface SelectFromDataTable extends ButtonProps {
	itemName: string;
	apiUrl: string;
	_value?: Record<string, any>;
	_onChange: (e: Record<string, any>) => any;
	displayRow: (e: any) => JSX.Element;
	hiddenSearchInput?: boolean;
	hiddenTitleButton?: boolean;
	dtMaxH?: string;
}

function rowSelection2Object(r: RowSelectionState) {
	const value = Object.keys(r)[0];
	return value ? JSON.parse(value) : undefined;
}

function object2RowSelection(r: Record<string, any>) {
	return {
		[JSON.stringify(r)]: true,
	};
}

const SelectFromDataTable = ({
	itemName,
	apiUrl,
	hiddenTitleButton,
	hiddenSearchInput,
	displayRow,
	_onChange,
	_value,
	dtMaxH,
	leftIcon,
	children,
	...rest
}: SelectFromDataTable) => {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchValue, setSearchValue] = useState('');

	const [rowSelection, setRowSelection] = useState<RowSelectionState>(
		_value !== undefined ? object2RowSelection(_value) : {}
	);

	const title = `Pilih ${itemName}`;
	const rightIconSize = leftIcon ? '20px' : '15px';

	const submitHandler = async () => {
		const value = rowSelection2Object(rowSelection);
		if (value === undefined) {
			return toast({
				title: `Opss`,
				description: `Belum ada ${itemName} yang dipilih`,
				status: 'warning',
			});
		}
		if (_onChange) _onChange(value);
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
						children={displayRow(row.original)}
					/>
				),
			}),
		],
		[]
	);

	return (
		<>
			<Button
				py={leftIcon ? '8' : undefined}
				colorScheme="blue"
				variant="outline"
				bg="gray.50"
				justifyContent="start"
				rightIcon={<IconChevronDown size={rightIconSize} />}
				onClick={onOpen}
				leftIcon={leftIcon}
				{...rest}
			>
				{children ? (
					<Box flex="1 0 0" textAlign="left">
						{children}
					</Box>
				) : (
					<Box
						flex="1 0 0"
						maxW={`calc(100% - ${rightIconSize})`}
						textTransform="capitalize"
						textAlign="left"
					>
						{!hiddenTitleButton && (
							<Text mb="1" fontSize="sm" children={itemName} />
						)}
						<Text
							overflow="hidden"
							textOverflow="ellipsis"
							whiteSpace="nowrap"
							children={_value?.name || title}
						/>
					</Box>
				)}
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
					<ModalHeader textTransform="capitalize">{title}</ModalHeader>
					<ModalBody>
						{!hiddenSearchInput && (
							<InputSearch
								placeholder={'Cari Nama ' + itemName}
								name="search"
								w="100%"
								mb="2"
								_onSubmit={setSearchValue}
							/>
						)}

						<DataTable
							maxH={dtMaxH || '300px'}
							columns={columns}
							withHeader={false}
							apiUrl={apiUrl}
							searchQuery={searchValue}
							emptyMsg={[`${itemName} tidak ditemukan`]}
							rowSelection={rowSelection}
							onRowSelectionChange={setRowSelection}
							getRowId={(e) => JSON.stringify(e)}
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
};

export default SelectFromDataTable;
