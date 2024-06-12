import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, useDisclosure, ButtonProps, VStack, Checkbox, Flex, Portal} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { IconChevronDown, IconWind } from '@tabler/icons-react';

export const airParameters = [
	{ label: 'PM10', id: 'pm25', value: false },
	{ label: 'PM2.5', id: 'pm100', value: false },
	{ label: 'CH4', id: 'ch4', value: false },
	{ label: 'CO2', id: 'co2', value: false },
];

const parseValue = (value: string) => {
	const jj = value.split(',').map((e) => e.trim());
	return airParameters.map(({ id, label }) => ({
		id,
		label,
		value: jj.includes(id),
	}));
};

const stringifyValue = (value: typeof airParameters, key: 'label' | 'id') => {
	return value
		.filter((e) => e.value)
		.map((e) => e[key])
		.join(', ');
};

interface params extends ButtonProps {
	airParamsvalue: string;
	airParamsOnChange: (v: string) => any;
}

export default function SelectAirParams({
	airParamsvalue,
	airParamsOnChange,
	...rest
}: params) {
	const toast = useToast();
	const [value, setValue] = useState(parseValue(airParamsvalue));
	const { isOpen, onOpen, onClose } = useDisclosure();

	const onChangeHandle = (id: string) => {
		setValue((prev) =>
			prev.map((e) => (e.id === id ? { ...e, value: !e.value } : e))
		);
	};

	const submitHandler = async () => {
		if (!value.length) {
			return toast({
				title: `Opss`,
				description: `Belum ada yang dipilih`,
				status: 'warning',
			});
		}

		airParamsOnChange(stringifyValue(value, 'id'));
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
				leftIcon={<IconWind size="28" />}
				onClick={onOpen}
				{...rest}
			>
				<VStack spacing="1" align="start" px="1" w="full">
					<Text textTransform="capitalize" fontSize="sm" color="gray.500">
						Parameter
					</Text>
					<Text textTransform="uppercase">
						{stringifyValue(parseValue(airParamsvalue), 'label') || '-'}
					</Text>
				</VStack>
			</Button>
			<Portal>

			
			<Modal
				size="xl"
				autoFocus={false}
				isOpen={isOpen}
				onClose={onClose}
				closeOnOverlayClick={false}
				onCloseComplete={() => setValue(parseValue(airParamsvalue))}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Pilih Paramater Udara</ModalHeader>
					<ModalBody>
						<Flex gap="4" wrap="wrap">
							{value.map(({ id, label, value }) => (
								<Checkbox
									key={id}
									size="lg"
									flexGrow="1"
									colorScheme="green"
									isChecked={value}
									onChange={() => onChangeHandle(id)}
									children={label}
								/>
							))}
						</Flex>
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
			</Portal>
		</>
	);
}
