import { Radio, Text, Box, BoxProps } from '@chakra-ui/react';

export function MyRadio({ value, children , ...props}: BoxProps & { value: string; }) {
	return (
		<Box
			border="1px solid"
			borderColor="gray.200"
			px="2"
			py="1"
			rounded="full"
			as="label"
			cursor="pointer"
			bg='white'
			{...props}
		>
			<Radio size="lg" value={value}>
				<Text pr="2" pl='1' fontSize="md" children={children} />
			</Radio>
		</Box>
	);
}
