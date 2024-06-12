import { Box, Button} from '@chakra-ui/react'; //prettier-ignore
import { Container, HStack, Heading, Text } from '@chakra-ui/react';
import UserSubscribedNodesList from '@/pages/admin/users/DTUserSubscribedNodes';
import useUser from '@/hooks/useUser';
import { IconCirclePlus } from '@tabler/icons-react';
import { AddNodeUserSubscription } from '../../../components/common/AddNodeSubscription';

export default function MyNodes() {
	const { user } = useUser();

	return (
		<Box>
			<HStack justify="space-between">
				<Box>
					<Heading size="lg">Sensor Saya</Heading>
					<Text>Daftar sensor yang Anda ikuti</Text>
				</Box>
				<Button
					as={AddNodeUserSubscription}
					userId={user.userId}
					countSubscribedNode={3}
					colorScheme="blue"
					leftIcon={<IconCirclePlus size="18" />}
					children="Tambahkan Node"
				/>
			</HStack>
			<Container maxW="container.md" mt="6">
				<UserSubscribedNodesList data={user} />
			</Container>
		</Box>
	);
}