import { Center, HStack, Heading } from "@chakra-ui/react";

interface IHeadingWithIcon {
	Icon: any;
	text: string;
}
export default function HeadingWithIcon({ Icon, text }: IHeadingWithIcon) {
	return (
		<HStack spacing="3">
			<Center boxSize="30px" boxShadow="xs" bg="gray.100" rounded="md" p="1">
				{Icon}
			</Center>
			<Heading fontSize="xl" fontWeight="600">
				{text}
			</Heading>
		</HStack>
	);
}
