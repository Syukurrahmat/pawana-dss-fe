import { API_URL } from '@/constants/config';
import { fetcher } from '@/utils/index.utils';
import { Avatar, Box, Container, HStack, Heading, Tag, Text, Button, Spacer, useDisclosure, Link} from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconEdit, IconLock, IconMail, IconPennant, IconPhone, IconTextCaption, IconUserBolt, IconUserQuestion, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditUserProfileButton from './EditUserProfile';
import EditPasswordButton from './EditUserPass';
import SectionTitle from '@/components/common/sectionTitle';
import HeadingWithIcon from '@/components/common/headingWithIcon';
import GroupListDetailUser from './detailUserTables/GroupList';
import UserRequestedGroupList from './detailUserTables/RequestedGroupList';

export default function DetailUser() {
	let { id } = useParams();
	const { data: rawData, isLoading, error, mutate } = useSWR(API_URL + '/users/' + id, fetcher); // prettier-ignore
	const data = rawData?.result;

	if (!data) return '';

	return (
		<>
			<HeadingWithIcon Icon={<IconUserBolt />} text="Detail Akun" />
			<Container mt="8" maxW="container.md">
				<HStack spacing="6">
					<Avatar rounded="md" size="2xl" name={data.name} />
					<Box>
						<Tag colorScheme={data.isVerified ? 'green' : 'red'}>
							{data.isVerified ? 'Terverifikasi' : 'Belum diverifikasi'}
						</Tag>
						<Heading mb="1" fontSize="2xl">
							{data.name}
						</Heading>
						<HStack>
							<IconMail size="16" />
							<Link href={'mailto:' + data.email}>
								<Text>{data.email}</Text>
							</Link>
						</HStack>
						<HStack>
							<IconPhone size="16" />
							<Link href={'tel:' + data.phone}>
								<Text>{data.phone}</Text>
							</Link>
						</HStack>
					</Box>
					<Spacer />
					<EditUserProfileButton
						colorScheme="blue"
						alignSelf="start"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Profil'}
						data={data}
						mutate={mutate}
					/>
				</HStack>
				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi pengguna
				</SectionTitle>
				{data.description ? (
					<Text>{data.description}</Text>
				) : (
					<Text fontStyle="italic" color="gray.500">
						(Tidak Ada Deskripsi pengguna)
					</Text>
				)}

				<SectionTitle IconEl={IconUsersGroup}>
					Grup yang Anda Ikuti
					<Tag colorScheme="blue" ml="2">
						{data.groupCount | 0}
					</Tag>
				</SectionTitle>

				<GroupListDetailUser data={data} />
				{Boolean(data.requestGroupCount) && (
					<>
						<SectionTitle IconEl={IconPennant}>
							Permintaan bergabung ke group
							<Tag colorScheme="blue" ml="2">
								{data.requestGroupCount | 0}
							</Tag>
						</SectionTitle>

						<UserRequestedGroupList />
					</>
				)}

				<SectionTitle IconEl={IconLock}>Autentikasi</SectionTitle>
				<HStack justify="space-between">
					<EditPasswordButton colorScheme="yellow" data={data}>
						Ganti Kata Sandi
					</EditPasswordButton>
					<Button colorScheme="red">Hapus Akun</Button>
				</HStack>
			</Container>
		</>
	);
}
