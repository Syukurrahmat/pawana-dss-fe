import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import { Box, Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Text, useDisclosure, useToast } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronDown } from '@tabler/icons-react';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const columnHelper = createColumnHelper<searchGroupWithSubsResult>();

type ObjectOfAny = { [key: string]: any };
type ValToSS = (v: ObjectOfAny) => RowSelectionState;
type SsToVal = (r: RowSelectionState) => ObjectOfAny;

const sortObjectKeys = (obj: ObjectOfAny = {}) => {
	const sortedObj = {};
	const keys = Object.keys(obj);
	keys.sort();
	keys.forEach((key) => {
		// @ts-ignore
		sortedObj[key] = obj[key];
	});
	return sortedObj;
};

const valueToSelectState: ValToSS = (v) => ({
	[JSON.stringify(sortObjectKeys(v))]: true,
});

const selectStateToValue: SsToVal = (r) => {
	return JSON.parse(Object.keys(r)[0] || '{}');
};

export interface SelectFromDataTable extends ButtonProps {
	itemName: string;
	apiUrl: string;
	selectValue: ObjectOfAny;
	selectOnChange: React.Dispatch<React.SetStateAction<ObjectOfAny>>;
	displayRow: (e: any) => JSX.Element;
	hiddenSearchInput?: boolean;
	hiddenTitleButton?: boolean;
	dtMaxH?: string;
}

export default function SelectFromDataTable(props: SelectFromDataTable) {
	const {
		itemName,
		apiUrl,
		hiddenTitleButton,
		hiddenSearchInput,
		displayRow,
		selectValue,
		selectOnChange,
		dtMaxH,
		leftIcon,
		children,
		...rest
	} = props;

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchValue, setSearchValue] = useState('');
	const [rowSelection, setRowSelection] = useState(
		valueToSelectState(selectValue)
	);

	const title = `Pilih ${itemName}`;

	const submitHandler = async () => {
		if (!rowSelection) {
			return toast({
				title: `Opss`,
				description: `Belum ada ${itemName} yang dipilih`,
				status: 'warning',
			});
		}
		selectOnChange(selectStateToValue(rowSelection));
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
				bg="white"
				rightIcon={<IconChevronDown size={leftIcon ? '20' : '15'} />}
				onClick={onOpen}
				leftIcon={leftIcon}
				{...rest}
			>
				{children || (
					<Box
						flexGrow="1"
						maxW="90%"
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
							children={selectValue?.name || title}
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
								mb="5"
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
							setRowSelection={setRowSelection}
							enableMultiRowSelection={false}
							getRowId={(e: any) => JSON.stringify(sortObjectKeys(e))}
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
