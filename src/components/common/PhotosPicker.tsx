import { Input, Box, Button, Flex, Icon, Image, CloseButton, Text, BoxProps } from '@chakra-ui/react'; // prettier-ignore
import { IconCameraPlus } from '@tabler/icons-react';

interface PhotosPicker extends BoxProps {
	values: (File | null)[];
	onChange: (e: any) => any;
}

export function PhotosPicker({ values, onChange, ...rest }: PhotosPicker) {
	const filteredSelectedImage = values.filter((e) => e);

	return (
		<Box {...rest}>
			<Flex gap="3" flexWrap="wrap">
				{values.map((img, i) => (
					<Box
						key={i}
						position="relative"
						flexGrow="1"
						flexShrink="0"
						w="100px"
						h="100px"
					>
						<Button
							p="0"
							w="full"
							h="full"
							as="label"
							variant="outline"
							overflow="hidden"
							cursor="pointer"
						>
							{img ? (
								<Image
									objectFit="cover"
									src={URL.createObjectURL(img)}
								/>
							) : (
								<Icon
									as={IconCameraPlus}
									boxSize="30px"
									color="gray.400"
								/>
							)}

							<Input
								type="file"
								accept="image/*"
								display="none"
								onChange={(event) => {
									onChange(
										(() => {
											let curr = [...values];
											if (event.target.files)
												curr[i] = event.target.files[0];
											return curr;
										})()
									);
								}}
							/>
						</Button>
						{img && (
							<CloseButton
								size="sm"
								onClick={() => {
									onChange(
										(() => {
											let curr = [...values];
											curr[i] = null;
											return curr;
										})()
									);
								}}
								bg="gray.300"
								position="absolute"
								top="10px"
								right="10px"
							/>
						)}
					</Box>
				))}
			</Flex>
			<Text mt="2" fontSize="sm">
				{filteredSelectedImage.length
					? filteredSelectedImage.length + ' Foto ditambahkan'
					: 'Belum ada foto yang ditambahkan'}
			</Text>
		</Box>
	);
}
