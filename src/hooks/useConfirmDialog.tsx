import { useRef, Dispatch, SetStateAction, createContext, useContext, useState } from 'react'; //prettier-ignore
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button} from '@chakra-ui/react'; //prettier-ignore

type ConfirmDialogContext = Dispatch<SetStateAction<ConfirmMessage>>;

const ConfirmDialogContext = createContext<ConfirmDialogContext>(() => {});

export default function useConfirmDialog() {
	return useContext(ConfirmDialogContext);
}

export function ConfirmDialogProvider(props: any) {
	const [alertMessage, setAlertMessage] = useState<ConfirmMessage>(null);

	return (
		<ConfirmDialogContext.Provider value={setAlertMessage}>
			{props.children}
			<MyConfirmDialog messageContext={[alertMessage, setAlertMessage]} />
		</ConfirmDialogContext.Provider>
	);
}

interface MyConfirmDialog {
	messageContext: [ConfirmMessage, ConfirmDialogContext];
}

function MyConfirmDialog({ messageContext }: MyConfirmDialog) {
	const cancelRef = useRef();
	const [alertMessage, setAlertMessage] = messageContext;
	const [isLoading, setIsLoading] = useState(false);

	const onClose = () => {
		setAlertMessage(null);
	};

	return (
		<AlertDialog
			isOpen={Boolean(alertMessage)}
			motionPreset="slideInBottom"
			onClose={onClose}
			leastDestructiveRef={cancelRef as any}
			closeOnEsc={!isLoading}
			closeOnOverlayClick={!isLoading}
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						{alertMessage?.title}
					</AlertDialogHeader>
					<AlertDialogBody>{alertMessage?.message}</AlertDialogBody>
					<AlertDialogFooter>
						<Button
							ref={cancelRef.current}
							isDisabled={isLoading}
							onClick={onClose}
						>
							Batal
						</Button>
						<Button
							isLoading={isLoading}
							colorScheme={alertMessage?.confirmButtonColor || 'blue'}
							onClick={async () => {
								setIsLoading(true);
								await alertMessage?.onConfirm();
								setIsLoading(false);
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
