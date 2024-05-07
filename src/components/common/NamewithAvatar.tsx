import { Avatar, HStack, StackProps, Text } from '@chakra-ui/react';

interface INameWithAvatar extends StackProps {
	name: string;
	profilePicture?: string | undefined;
}

export default function NameWithAvatar({
	name,
	profilePicture,
}: INameWithAvatar) {
	return (
		<HStack spacing="4">
			<Avatar name={name} src={profilePicture} size="sm" />
			<Text>{name} </Text>
		</HStack>
	);
}
