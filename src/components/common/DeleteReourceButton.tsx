import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Input,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
} from '@chakra-ui/react';

import { useMyToasts } from '@/utils/common.utils';
import { myAxios } from '@/utils/fetcher';
import { ButtonProps, Text, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

interface DeleteResource extends ButtonProps {
	resource: string;
	name: string;
	deleteApiUrl: string;
	redirectPath: string;
}

export default function DeleteResourceButton({
	resource,
	name,
	deleteApiUrl,
	redirectPath,
	...rest
}: DeleteResource) {
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [step, setStep] = useState(0);
	const toast = useMyToasts();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<any>();

	const onSubmit = () => {
		setIsLoading(true);
		myAxios
			.delete(deleteApiUrl)
			.then(() => {
				toast.success(resource + ' berhasil dihapus');
				navigate(redirectPath);
				mutate(
					(e) => typeof e == 'string' && e.startsWith(deleteApiUrl),
					undefined
				);
			})
			.catch(() => {
				toast.error(resource + ' gagal dihapus');
			})
			.finally(() => {
				setIsLoading(false);
				setInputValue('');
				onClose();
			});
	};

	return (
		<>
			<Button colorScheme="red" {...rest} onClick={onOpen}>
				Hapus {resource}
			</Button>
			<AlertDialog
				isOpen={isOpen}
				motionPreset="slideInBottom"
				onClose={onClose}
				onCloseComplete={() => {
					setStep(0);
					setInputValue('');
				}}
				leastDestructiveRef={cancelRef}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold" pb="2">
							Hapus {resource}
						</AlertDialogHeader>
						<AlertDialogBody>
							<Tabs size="md" index={step}>
								<TabPanels>
									<TabPanel as={VStack} p="0" align='start'>
										<Text>
											Anda yakin hendak menghapus{' '}
											<Text as="span" fontWeight="600">
												{resource} {name}
											</Text>
										</Text>
										<Text>
											Operasi ini akan menghapus secara permanen{' '}
											{resource.toLowerCase()} tersebut beserta semua
											data yang terkait.
										</Text>
									</TabPanel>
									<TabPanel as={VStack} p="0">
										<Text>
											Untuk mengonfirmasi, ketikkan "
											<Text
												as="span"
												fontWeight="600"
												children={name}
											/>
											" pada kotak di bawah ini.
										</Text>
										<Input
											value={inputValue}
											onChange={(e) => setInputValue(e.target.value)}
										/>
									</TabPanel>
								</TabPanels>
							</Tabs>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								ref={cancelRef.current}
								isDisabled={isLoading}
								onClick={onClose}
							>
								Batal
							</Button>
							{step == 0 ? (
								<Button
									onClick={() => setStep(1)}
									colorScheme="red"
									ml={3}
									children="Konfirmasi"
								/>
							) : (
								<Button
									colorScheme="red"
									isDisabled={inputValue !== name}
									ml={3}
									children={'Hapus ' + resource}
									onClick={onSubmit}
								/>
							)}
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
