import { Avatar, AvatarProps, HStack, Text } from '@chakra-ui/react';

interface INameWithAvatar {
	name: string;
	profilePicture?: string | undefined;
	size?: string;
	spacing?: string;
}

export default function NameWithAvatar({
	name,
	profilePicture,
	size,
	spacing,
}: INameWithAvatar) {
	return (
		<HStack spacing={spacing || '4'}>
			<Avatar name={name} src={profilePicture} size={size || 'sm'} />
			<Text>{name} </Text>
		</HStack>
	);
}
