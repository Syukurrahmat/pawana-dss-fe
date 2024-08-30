import { Box, Button, Container, HStack, Heading, Text } from '@chakra-ui/react'; //prettier-ignore
import useUser from '@/hooks/useUser';
import { IconCirclePlus } from '@tabler/icons-react';
import ManagedCompaniesList from '@/pages/admin/Users/DTManagedCompanies';
import { Link } from 'react-router-dom';

export default function MyCompanies() {
	const { user } = useUser();

	return (
		<Box>
			<HStack flexWrap='wrap' justify="space-between">
				<Box>
					<Heading size="lg">Perusahaan saya</Heading>
					<Text>Daftar perusahaan yang Anda Buat</Text>
				</Box>
				<Link to={'/companies/create'}>
					<Button
						colorScheme="blue"
						leftIcon={<IconCirclePlus size="18" />}
						children='Tambahkan Perusahaan'
					/>
				</Link>
			</HStack>
			<Container px='0' maxW="container.md" mt="6">
				<ManagedCompaniesList data={user} />
			</Container>
		</Box>
	);
}
