import { Center, HStack, Heading, StackProps } from "@chakra-ui/react";

interface IHeadingWithIcon extends StackProps{
	Icon: any;
	text: string;
}
export default function HeadingWithIcon({ Icon, text, ...props }: IHeadingWithIcon) {
	return (
		<HStack spacing="3" {...props}>
			<Center boxSize="30px" boxShadow="xs" bg="gray.100" rounded="md" p="1">
				{Icon}
			</Center>
			<Heading fontSize="xl" fontWeight="600">
				{text}
			</Heading>
		</HStack>
	);
}
