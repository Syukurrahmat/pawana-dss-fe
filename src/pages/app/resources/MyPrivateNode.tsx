import DataTable from '@/components/DataTable';
import useUser from '@/hooks/useUser';
import { Box, Button, Container, HStack, Heading, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { columPrivateNodeTable } from '../admin/nodes/Nodes';

export default function MyPrivateNode() {
	const { user } = useUser();
 
	return (
		<Box>
			<HStack justify="space-between">
				<Box>
					<Heading size="lg">Sensor Saya</Heading>
					<Text>Daftar sensor private di usaha-usaha Anda</Text>
				</Box>

				<Link to="./create">
					<Button
						leftIcon={<IconPlus size="20px" />}
						colorScheme="green"
						children="Tambah Node"
					/>
				</Link>
			</HStack>
			<Container maxW="container.md" mt="6">
				<DataTable
					mt="4"
					flexGrow="1"
					apiUrl={`/users/${user.userId}/own-nodes`}
					columns={columPrivateNodeTable}
				/>
			</Container>
		</Box>
	);
}
