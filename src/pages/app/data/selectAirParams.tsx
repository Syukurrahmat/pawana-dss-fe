import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, useToast, Text, useDisclosure, ButtonProps, VStack, Checkbox, Flex} from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { IconChevronDown, IconWind } from '@tabler/icons-react';

export const airParameters = ['PM10', 'PM2.5', 'CH4', 'CO2', 'TEMP', 'HUMIDITY'];

interface ISelectAirParams extends ButtonProps {
	onChange?: (e: any) => any;
	state: [boolean[], React.Dispatch<React.SetStateAction<boolean[]>>];
}

export default function SelectAirParams({
	state,
	onChange,
	...rest
}: ISelectAirParams) {
	const toast = useToast();
	const [preValue, setPreValue] = state;
	const [value, setValue] = useState(preValue);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const submitHandler = async () => {
		if (!value.length) {
			toast({
				title: `Opss`,
				description: `Belum ada yang dipilih`,
				status: 'warning',
			});
			return;
		}

		setPreValue(value);
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
				<VStack spacing="1" align="start" px="1">
					<Text textTransform="capitalize" fontSize="sm" color="gray.500">
						Parameter
					</Text>
					<Text textTransform="uppercase">
						{preValue
							.map((e, i) => (e ? airParameters[i] : ''))
							.filter((e) => e)
							.join(', ') || '-'}
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
					setValue(preValue);
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						Pilih Paramater Udara
						<Text fontSize="md">Maksimal tiga</Text>
					</ModalHeader>
					<ModalBody>
						<Flex gap="4" wrap="wrap">
							{airParameters.map((parameter, index) => (
								<Checkbox
									key={index}
									size="lg"
									flexGrow="1"
									colorScheme="green"
									isChecked={value[index]}
									onChange={() => {
										setValue((old) =>
											old.map((item, i) =>
												i === index ? !item : item
											)
										);
									}}
								>
									{parameter}
								</Checkbox>
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
		</>
	);
}
