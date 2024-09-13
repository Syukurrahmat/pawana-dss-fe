import GMapsButton from '@/components/common/GMapsButton';
import { Box, Button, HStack, Input, Spacer, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconDeviceFloppy, IconEdit, IconMapCancel } from '@tabler/icons-react'; //prettier-ignore

interface EditInMapInputGroup {
	coordinate: number[];
	isEditingState: StateOf<boolean>;
	editedCoordinateState: StateOf<number[]>;
	isSubmiting: boolean;
	canEdit: boolean;
	handleSubmitEditedCoordinate: () => any;
}

export default function EditInMapInputGroup({
	coordinate,
	isEditingState,
	canEdit,
	editedCoordinateState,
	isSubmiting,
	handleSubmitEditedCoordinate,
}: EditInMapInputGroup) {
	const [isEditing, setIsEditing] = isEditingState;
	const [editedCoordinate, setEditedCoordinate] = editedCoordinateState;

	return (
		<HStack align="start" wrap="wrap-reverse">
			{!isEditing ? (
				<HStack justify='space-between' w='full' wrap="wrap">
					<GMapsButton size="md" coordinate={coordinate}>
						Buka lokasi Perusahaan di Gmaps
					</GMapsButton>
					<Spacer />

					{canEdit && (
						<Button
							colorScheme="yellow"
							leftIcon={<IconEdit size="18" />}
							children="Sunting lokasi perusahaan"
							onClick={() => setIsEditing(true)}
						/>
					)}
				</HStack>
			) : (
				<>
					<VStack align="start" >
						<HStack w="full">
							<Box w="full">
								<Text fontSize="sm">Masukkan Latitude</Text>
								<Input
									mt="2"
									bg="white"
									type="number"
									value={editedCoordinate[0]}
									onChange={(e) =>
										setEditedCoordinate((prev) => [
											parseFloat(e.target.value),
											prev[1],
										])
									}
								/>
							</Box>
							<Box w="full">
								<Text fontSize="sm">Masukkan langitude</Text>
								<Input
									mt="2"
									type="number"
									bg="white"
									value={editedCoordinate[1]}
									onChange={(e) =>
										setEditedCoordinate((prev) => [
											prev[0],
											parseFloat(e.target.value),
										])
									}
								/>
							</Box>
						</HStack>
						<Text fontSize="sm">
							Atau geser peta dan sesuaikan penanda ke titik yang
							dimaksud
						</Text>
					</VStack>
					
					<Spacer />

					<HStack mt='1' justify='end' w='full'>
						<Button
							colorScheme="red"
							leftIcon={<IconMapCancel size="18" />}
							children="Batal Sunting"
							onClick={() => {
								setEditedCoordinate(coordinate);
								setIsEditing(false);
							}}
							isDisabled={isSubmiting}
						/>
						<Button
							colorScheme="blue"
							leftIcon={<IconDeviceFloppy size="18" />}
							children="Simpan"
							isLoading={isSubmiting}
							onClick={handleSubmitEditedCoordinate}
						/>
					</HStack>
				</>
			)}
		</HStack>
	);
}
