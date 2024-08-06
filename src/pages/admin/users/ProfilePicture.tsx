import { Avatar, Box, HStack, Text, Button, Spacer, ModalOverlay, Modal, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, VStack, ModalCloseButton } from '@chakra-ui/react';
import { IconEdit, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';
import { API_URL } from '@/constants/config';

export function ProfilePicture({ name, src }: { name: string; src?: string; }) {
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
				name={name} />
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
									name={name} />
							) : (
								<AvatarEditor
									ref={avatarEditorRef as any}
									image={URL.createObjectURL(img)}
									width={250}
									height={250}
									border={0}
									color={[255, 255, 255, 0.6]}
									rotate={0} />
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
								children="Hapus" />
						)}
						<Spacer />
						<Button
							colorScheme="orange"
							leftIcon={<IconEdit size="18" />}
							onClick={() => {
								if (inputRef.current) inputRef.current.click();
							}}
							children="Ubah" />

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
							onChange={(e) => e.target.files ? setImg(e.target.files[0]) : null} />
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
