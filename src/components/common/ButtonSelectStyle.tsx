import { Button, Text, ButtonProps, VStack} from '@chakra-ui/react'; //prettier-ignore
import { IconChevronDown } from '@tabler/icons-react';

interface ButtonSelectStyle extends ButtonProps {
	title: string;
	value: string;
}

export default function ButtonSelectStyle({
	title,
	value,
	...rest
}: ButtonSelectStyle) {

	return (
		<Button
			py="8"
			size="lg"
			fontSize="md"
			shadow="xs"
			border="0px solid"
			bg="gray.50"
			colorScheme="blue"
			variant="outline"
			rightIcon={<IconChevronDown size="20" />}
			{...rest}
		>
			<VStack spacing="1" align="start" px="1">
				<Text
					textTransform="capitalize"
					fontSize="sm"
					color="gray.500"
					children={title}
				/>
				<Text textTransform="uppercase" children={value} />
			</VStack>
		</Button>
	);
}
