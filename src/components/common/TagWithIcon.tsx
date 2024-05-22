import { Tag, TagLabel, TagLeftIcon, TagProps } from "@chakra-ui/react";

interface ITagWithIcon extends TagProps {
	icon: any;
}

export default function TagWithIcon({ icon, ...rest }: ITagWithIcon) {
	return (
		<Tag size="md" variant="subtle" colorScheme="green" {...rest}>
			<TagLeftIcon boxSize="16px" as={icon} />
			<TagLabel>{rest.children}</TagLabel>
		</Tag>
	);
}