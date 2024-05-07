import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, useDisclosure, ButtonProps, VStack} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import { DateRange, Range } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';
 
interface ISelectDateRange extends ButtonProps {
	state: [Range, React.Dispatch<React.SetStateAction<Range>>];
	onChange?: (e: any) => any;
}

export default function SelectDateRange({
	state,
	onChange,
	...rest
}: ISelectDateRange) {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [savedValue, setSavedValue] = state
	const [value, setValue] = useState(savedValue);

	const submitHandler = async () => {
		if (!value) {
			toast({
				title: `Opss`,
				description: `Belum ada yang dipilih`,
				status: 'warning',
			});
			return;
		}

		setSavedValue(value);
		onClose();
	};

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
				leftIcon={<IconCalendar size="28" />}
				onClick={onOpen}
				{...rest}
			>
				<VStack spacing="1" align="start" px="1">
					<Text textTransform="capitalize" fontSize="sm" color="gray.500">
						Rentang Tanggal
					</Text>
					<Text textTransform="uppercase">
						{savedValue
							? [savedValue.startDate, savedValue.endDate]
									.map((e) => moment(e).format('DD/MM/yyyy'))
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
					setValue(savedValue);
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Pilih Tanggal</ModalHeader>
					<ModalBody>
						<DateRange
							className="date-picker"
							onChange={(item) => setValue(item.selection)}
							moveRangeOnFirstSelection={false}
							ranges={[value]}
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
