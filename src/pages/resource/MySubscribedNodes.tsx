import { Box, Button} from '@chakra-ui/react'; //prettier-ignore
import { Container, HStack, Heading, Text } from '@chakra-ui/react';
import UserSubscribedNodesList from '@/pages/admin/users/DTUserSubscribedNodes';
import useUser from '@/hooks/useUser';
import { IconCirclePlus } from '@tabler/icons-react';
import NodeSubscription from '@/components/common/AddNodeSubscription';

export default function MySubscribedNodes() {
	const { user } = useUser();

	return (
		<Box>
			<HStack justify="space-between">
				<Box>
					<Heading size="lg">Sensor Saya</Heading>
					<Text>Daftar sensor yang Anda ikuti</Text>
				</Box>
				<NodeSubscription
					subsInfo={{
						type: 'user',
						userId: user.userId,
					}}
				>
					<Button
						colorScheme="blue"
						leftIcon={<IconCirclePlus size="18" />}
						children="Tambahkan Node"
					/>
				</NodeSubscription>
			</HStack>
			<Container maxW="container.md" mt="6">
				<UserSubscribedNodesList data={user} />
			</Container>
		</Box>
	);
}
