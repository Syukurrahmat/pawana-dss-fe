import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import { BoxProps, HStack, Heading } from '@chakra-ui/react';

interface HeaderProps extends BoxProps {
	activeNav: any;
}

export default function Header({ activeNav, ...props }: HeaderProps) {

	return (
		<HStack
			p="5"
			borderBottom="1px solid var(--chakra-colors-gray-200)"
			justify="space-between"
			{...props}
		>
			<Heading color="gray.600" size="md" children={activeNav.label} />

			{activeNav.showChangeDahshButton && <ChangeActiveDashboard />}
		</HStack>
	);
}
