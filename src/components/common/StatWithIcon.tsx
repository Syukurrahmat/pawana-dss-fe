import { HStack, Text, VStack, Icon } from '@chakra-ui/react';
import { StackProps } from '@chakra-ui/react';

interface StatWithIcon extends StackProps {
	label: string;
	count: number;
	icon: any;
	color?: string;
	variant?: 'solid' | 'outline';
}

export function StatWithIcon({
	color = 'blue',
	label,
	icon,
	count,
	variant = 'outline',
	...rest
}: StatWithIcon) {
	return (
		<VStack
			p="2"
			justify='center'
			rounded="md"
			h='fit-content'
			spacing="0"
			sx={
				variant == 'outline'
					? {
							border: '2px solid',
							bg: color + '.50',
							borderColor: color + '.200',
					  }
					: {
							border: '2px solid',
							bg: color + '.400',
							justify: 'center',
							borderColor: color + '.400',
							color: 'white',
					  }
			}
			{...rest}
		>
			<HStack fontSize="3xl">
				<Icon
					color={variant == 'outline' ? color + '.500' : 'white'}
					as={icon}
					boxSize="28px"
				/>
				<Text fontWeight="600">{count}</Text>
			</HStack>
			<Text>{label}</Text>
		</VStack>
	);
}
