import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button} from '@chakra-ui/react'; //prettier-ignore
import { useRef } from 'react';

interface IMyAlert {
	messageContext: [
		alertMessageType,
		React.Dispatch<React.SetStateAction<alertMessageType>>
	];
}

export default function MyAlert({ messageContext }: IMyAlert) {
	const cancelRef = useRef();
	const [alertMessage, setAlertMessage] = messageContext;

	const onClose = () => {
		setAlertMessage(null);
	};

	return (
		<AlertDialog
			isOpen={Boolean(alertMessage)}
			motionPreset="slideInBottom"
			onClose={onClose}
			leastDestructiveRef={cancelRef as any}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						{alertMessage?.title}
						
					</AlertDialogHeader>
					<AlertDialogBody>
					{alertMessage?.message}
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef.current} onClick={onClose}>
							Batal
						</Button>
						<Button
							colorScheme={alertMessage?.confirmButtonColor || 'blue'}
							onClick={() => {
								alertMessage?.onConfirm()
								onClose();
							}}
							ml={3}
						>
							{alertMessage?.confirmText || 'Konfirmasi'}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}
