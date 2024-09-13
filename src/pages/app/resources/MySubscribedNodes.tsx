import NodeSubscription from '@/components/common/AddNodeSubscription';
import useUser from '@/hooks/useUser';
import UserSubscribedNodesList from '@/pages/admin/Users/DTUserSubscribedNodes';
import { Box, Button, Container, HStack, Heading, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus } from '@tabler/icons-react';

export default function MySubscribedNodes() {
	const { user } = useUser();

	return (
		<Box>
			<HStack justify="space-between">
				<Box>
					<Heading size="lg">Node Saya</Heading>
					<Text color='dimmed'>Daftar node yang Anda ikuti</Text>
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
			<Container maxW="container.md" px='0' mt="6">
				<UserSubscribedNodesList data={user} />
			</Container>
		</Box>
	);
}
