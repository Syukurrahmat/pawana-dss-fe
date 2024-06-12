import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle, Button, HStack } from '@chakra-ui/react';
import { IconChevronLeft, IconChevronRight, IconCirclePlus, IconLayoutNavbarExpand } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

export interface BigAlert extends AlertProps {
	title: string;
	description: string;
	onCreateAgain: () => any;
	detailPageURL?: string;
	itemName?: string;
}
export const BigAlert = ({
	title, description, detailPageURL, onCreateAgain, itemName, ...rest
}: BigAlert) => {
	const navigate = useNavigate();

	return (
		<Alert
			mt="10"
			px="6"
			py="10"
			rounded="lg"
			variant="subtle"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			textAlign="center"
			gap="2"
			{...rest}
		>
			<AlertIcon boxSize="50px" mr={0} />
			<AlertTitle fontSize="xl" children={title} />
			<AlertDescription maxW="lg" whiteSpace='pre-line' children={description} />
			<HStack mt="4">
				<Button
					leftIcon={<IconChevronLeft size="20" />}
					colorScheme="blue"
					variant="outline"
					children="Kembali"
					onClick={() => navigate(-1)} />
				<Button
					leftIcon={<IconCirclePlus size="20" />}
					colorScheme="blue"
					children="Buat lagi"
					onClick={onCreateAgain} />
				{!!detailPageURL && !!itemName && rest.status === 'success' && (
					<Link to={detailPageURL}>
						<Button
							leftIcon={<IconLayoutNavbarExpand size="20" />}
							colorScheme="blue"
							children={'Lihat ' + itemName}
							onClick={onCreateAgain} />
					</Link>
				)}
			</HStack>
		</Alert>
	);
};
