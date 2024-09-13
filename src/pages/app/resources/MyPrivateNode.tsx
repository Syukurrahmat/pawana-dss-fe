import DataTable from '@/components/DataTable';
import useUser from '@/hooks/useUser';
import { columPrivateNodeTable } from '@/pages/admin/Nodes/Nodes';
import { Box, Button, Container, HStack, Heading, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconCirclePlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function MyPrivateNode() {
	const { user } = useUser();

	return (
		<Box>
			<HStack flexWrap="wrap" justify="space-between">
				<Box>
					<Heading size="lg">Node Saya</Heading>
					<Text color='dimmed'>Daftar node private di perusahaan-perusahaan Anda</Text>
				</Box>

				<Link to="./create">
					<Button
						colorScheme="blue"
						leftIcon={<IconCirclePlus size="18" />}
						children="Tambah Node"
					/>
				</Link>
			</HStack>
			<Container maxW="container.md" px="0" mt="6">
				<DataTable
					mt="4"
					flexGrow="1"
					apiUrl={`/users/${user.userId}/private-nodes`}
					columns={columPrivateNodeTable}
				/>
			</Container>
		</Box>
	);
}
