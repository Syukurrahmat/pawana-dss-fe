import { Avatar, HStack, StackProps, Text } from '@chakra-ui/react';

interface INameWithAvatar extends StackProps {
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
	...rest
}: INameWithAvatar) {
	return (
		<HStack spacing={spacing || '4'} {...rest}>
			<Avatar name={name} src={profilePicture} size={size || 'sm'} />
			<Text>{name} </Text>
		</HStack>
	);
}
