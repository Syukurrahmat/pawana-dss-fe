import { apiFetcher, pageDataFetcher } from '@/utils/fetcher';
import { Avatar, Box, Container, HStack, Heading, Tag, Text, Button, Spacer, Link, ModalOverlay, Modal, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, VStack, ModalCloseButton} from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconEdit, IconInfoCircle, IconLock, IconMail, IconPhone, IconTextCaption, IconTrash, IconUserBolt } from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import EditUserProfileButton from './EditUserProfile';
import EditPasswordButton from './EditUserPass';
import SectionTitle from '@/components/common/SectionTitle';
import HeadingWithIcon from '@/components/common/HeadingWithIcon';
import SubscribedNodesList from './DTSubscribedNodes';
import ManagedCompaniesList from './DTManagedCompanies';
import { roleTagColor } from '@/constants/enumVariable';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import LoadingAnimation from '@/components/LoadingAnimation/LoadingAnimation';
import { TagUserRole } from '@/components/tags/index.tags';

export default function DetailUser() {
	let { id } = useParams();
	const { data, mutate } = useSWR<UserDataPage>(
		`/users/${id}`,
		pageDataFetcher
	);

	if (!data) return <LoadingAnimation />;

	return (
		<Box>
			<HeadingWithIcon Icon={<IconUserBolt />} text="Detail Akun" />
			<Container mt="8" maxW="container.md">
				<HStack spacing="6">
					<ProfilePicture name={data.name} src={data.profilePicture} />
					<Box>
						<TagUserRole role={data.role} />
						<Heading mb="1" fontSize="2xl">
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

				<Text
					fontStyle={data.description ? 'normal' : 'italic'}
					color={data.description ? 'inherit' : 'gray.500'}
					children={data.description || 'Tidak Ada Deskripsi pengguna'}
				/>

				{data.role == 'manager' && (
					<ManagedCompaniesList data={data} mutate={mutate} />
				)}

				<SubscribedNodesList data={data} mutate={mutate} />

				<SectionTitle IconEl={IconLock}>Autentikasi</SectionTitle>
				<HStack justify="space-between">
					<EditPasswordButton colorScheme="yellow" data={data}>
						Ganti Kata Sandi
					</EditPasswordButton>
					<Button colorScheme="red">Hapus Akun</Button>
				</HStack>
			</Container>
		</Box>
	);
}

function ProfilePicture({ name, src }: { name: string; src: string | null }) {
	const inputRef = useRef<HTMLInputElement>();
	const avatarEditorRef = useRef<any>();

	const [img, setImg] = useState<File | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const saveHandle = async () => {
		if (avatarEditorRef.current) {
			const img = avatarEditorRef.current.getImage().toDataURL(); // @ts-ignore

			axios
				.post(API_URL + '/upload', {
					images: [img],
				})
				.then((e) => console.log(e.data));

			// let img = await fetch(canvas)
			// 	.then((res) => res.blob())
			// 	.then((blob) => window.URL.createObjectURL(blob));
		}
	};

	return (
		<>
			<Avatar
				rounded="md"
				cursor="pointer"
				onClick={onOpen}
				size="2xl"
				src={src || undefined}
				name={name}
			/>
			<Modal
				autoFocus={false}
				isOpen={isOpen}
				onClose={onClose}
				onCloseComplete={() => setImg(null)}
				closeOnOverlayClick={false}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>Foto Profil Kamu</ModalHeader>
					<ModalBody py="0" as={VStack}>
						<Box
							boxSize="250px"
							rounded="xl"
							overflow="hidden"
							outline={img ? '3px solid' : ''}
							outlineColor="yellow.400"
						>
							{!img ? (
								<Avatar
									rounded="0"
									size="2xl"
									mx="auto"
									boxSize="full"
									aspectRatio={1}
									src={src || undefined}
									name={name}
								/>
							) : (
								<AvatarEditor
									ref={avatarEditorRef as any}
									image={URL.createObjectURL(img)}
									width={250}
									height={250}
									border={0}
									color={[255, 255, 255, 0.6]}
									rotate={0}
								/>
							)}
						</Box>
						<HStack alignSelf="start">
							<IconInfoCircle size="18" />
							<Text>
								{img
									? 'Paskan Foto dengan menggesernya'
									: !src
									? 'Anda Belum mengatur foto profil, Ayo atur sekarang'
									: 'Foto profil anda terlihat keren'}
							</Text>
						</HStack>
					</ModalBody>

					<ModalFooter as={HStack}>
						{!!src && (
							<Button
								leftIcon={<IconTrash size="18" />}
								colorScheme="red"
								children="Hapus"
							/>
						)}
						<Spacer />
						<Button
							colorScheme="orange"
							leftIcon={<IconEdit size="18" />}
							onClick={() => {
								if (inputRef.current) inputRef.current.click();
							}}
							children="Ubah"
						/>

						{!!img && (
							<Button
								type="submit"
								colorScheme="blue"
								onClick={saveHandle}
							>
								Simpan
							</Button>
						)}

						<Input
							ref={inputRef as any}
							type="file"
							display="none"
							accept="image/*"
							id="upload"
							onChange={(e) =>
								e.target.files ? setImg(e.target.files[0]) : null
							}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
