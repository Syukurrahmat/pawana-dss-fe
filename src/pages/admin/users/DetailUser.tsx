import DeleteResourceButton from '@/components/common/DeleteReourceButton';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import LoadingComponent from '@/components/common/LoadingComponent';
import SectionTitle from '@/components/common/SectionTitle';
import { TagUserRole } from '@/components/Tags/index.tags';
import useUser from '@/hooks/useUser';
import { fetcher } from '@/utils/fetcher';
import { Box, Button, Container, HStack, Heading, Link, Stack, Tag, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconCirclePlus, IconEdit, IconLock, IconMail, IconPhone, IconTextCaption, IconUser, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import { Link as Rlink, useLocation, useParams } from 'react-router-dom';
import useSWR from 'swr';
import ManagedCompaniesList from './DTManagedCompanies';
import UserSubscribedNodesList from './DTUserSubscribedNodes';
import EditPasswordButton from './EditUserPass';
import EditUserProfileButton from './EditUserProfile';
import { ProfilePicture } from './ProfilePicture';

export default function DetailUser() {
	const location = useLocation();
	const { user, roleIs } = useUser();

	const isProfilePage = location.pathname == '/account';
	const id = isProfilePage ? user.userId : useParams().id;

	const { data, mutate, error } = useSWR<UserDataPage>(
		`/users/${id}`,
		fetcher
	);

	if (error) throw error;
	if (!data) return <LoadingComponent />;

	return (
		<Box>
			<HeadingWithIcon Icon={<IconUser />} text="Detail Akun" />
			<Container mt="5" maxW="container.md" px="0">
				<Stack
					spacing="6"
					align="center"
					direction={{ base: 'column', sm: 'row' }}
					justify="center"
				>
					<ProfilePicture name={data.name} src={data.profilePicture} />

					<Box flex='1 0 0' w='full'>
						<TagUserRole  value={data.role} />
						<Heading my="1" fontSize="2xl">
							{data.name}
						</Heading>
						<HStack>
							<IconMail size="16" />
							<Link href={'mailto:' + data.email}>{data.email}</Link>
						</HStack>
						<HStack>
							<IconPhone size="16" />
							<Link href={'tel:' + data.phone}>{data.phone}</Link>
						</HStack>
					</Box>
					{(isProfilePage || roleIs('admin')) && (
						<EditUserProfileButton
							flexShrink="0"
							colorScheme="blue"
							alignSelf="start"
							leftIcon={<IconEdit size="16" />}
							children={'Sunting Profil'}
							data={data}
							mutate={mutate}
						/>
					)}
				</Stack>
				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconTextCaption}>
					Deskripsi pengguna
				</SectionTitle>

				<Text
					fontStyle={data.description ? 'normal' : 'italic'}
					color={data.description ? 'inherit' : 'gray.500'}
					children={data.description || 'Tidak Ada Deskripsi pengguna'}
				/>

				{!isProfilePage && (
					<>
						{/* DAFTAR USAHA YANG DIMANAGERI */}

						{data.role == 'manager' && (
							<>
								<SectionTitle IconEl={IconUsersGroup}>
									Perusahaan Anda
									<Tag colorScheme="blue" ml="2">
										{data.countManagedCompany || 0}
									</Tag>
								</SectionTitle>

								{roleIs('admin') && (
									<Rlink to={'/companies/create'}>
										<Button
											colorScheme="blue"
											leftIcon={<IconCirclePlus size="18" />}
											children="Tambahkan Perusahaan"
										/>
									</Rlink>
								)}
								<ManagedCompaniesList
									mt="4"
									data={data}
									mutate={mutate}
								/>
							</>
						)}

						{/* DAFTAR NODE YANG IA IKUTI */}
						{data.role == 'regular' && (
							<>
								<SectionTitle IconEl={IconUsersGroup}>
									Node yang Ikuti
									<Tag
										colorScheme="blue"
										ml="2"
										children={data.countSubscribedNodes || 0}
									/>
								</SectionTitle>

								{roleIs('admin') && (
									<HStack>
										<Button
											colorScheme="blue"
											leftIcon={<IconCirclePlus size="18" />}
											children="Tambahkan Node"
										/>
									</HStack>
								)}

								<UserSubscribedNodesList
									mt="4"
									data={data}
									mutate={mutate}
								/>
							</>
						)}
					</>
				)}
				{(isProfilePage || roleIs('admin')) && (
					<>
						<SectionTitle IconEl={IconLock}>Autentikasi</SectionTitle>
						<HStack justify="space-between">
							{isProfilePage && (
								<EditPasswordButton colorScheme="yellow" data={data}>
									Ganti Kata Sandi
								</EditPasswordButton>
							)}
							<DeleteResourceButton
								resource="Pengguna"
								name={data.name}
								colorScheme="red"
								deleteApiUrl={'/users/' + data.userId}
								redirectPath="/users"
							/>
						</HStack>
					</>
				)}
			</Container>
		</Box>
	);
}
