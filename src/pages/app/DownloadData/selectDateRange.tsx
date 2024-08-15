import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, useDisclosure, ButtonProps, VStack} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import { DateRange, Range } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';

interface params extends ButtonProps {
	dateRangeValue: Range;
	onChangeDateRange: (x: Range) => any;
}

export default function SelectDateRange({
	dateRangeValue,
	onChangeDateRange,
	...rest
}: params) {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [value, setValue] = useState(dateRangeValue);

	const submitHandler = async () => {
		if (!value) {
			toast({
				title: `Opss`,
				description: `Belum ada yang dipilih`,
				status: 'warning',
			});
			return;
		}

		onChangeDateRange(value);
		onClose();
	};

	return (
		<>
			<Button
				py="8"
				px="3"
				size="lg"
				fontSize="md"
				shadow="xs"
				border="0px solid"
				bg="gray.50"
				colorScheme="blue"
				variant="outline"
				rightIcon={<IconChevronDown size="20" />}
				leftIcon={<IconCalendar style={{ flexGrow: 1 }} size="28" />}
				onClick={onOpen}
				{...rest}
			>
				<VStack spacing="1" align="start" px="1" w="full">
					<Text textTransform="capitalize" fontSize="sm" color="gray.500">
						Rentang Tanggal
					</Text>
					<Text >
						{dateRangeValue
							? dateRangeValue.startDate == dateRangeValue.endDate
								? moment(dateRangeValue.startDate).format('DD MMM yyyy')
								: [dateRangeValue.startDate, dateRangeValue.endDate]
										.map((e) => moment(e).format('DD MMM yyyy'))
										.join(' - ')
							: '-'}
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
					setValue(dateRangeValue);
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Pilih Tanggal</ModalHeader>
					<ModalBody py="0">
						<DateRange
							className="date-picker"
							showDateDisplay={false}
							onChange={(item) => setValue(item.selection)}
							moveRangeOnFirstSelection={false}
							ranges={[{ ...value, key: 'selection' }]}
							dateDisplayFormat="dd MMM yyyy"
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
