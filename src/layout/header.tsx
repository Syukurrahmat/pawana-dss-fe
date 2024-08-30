import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import { BoxProps, HStack, Heading, IconButton } from '@chakra-ui/react';
import { IconMenu2 } from '@tabler/icons-react';

interface HeaderProps extends BoxProps {
	activeNav: any;
	setSidebarIsOpen: any;
}

export default function Header({
	activeNav,
	setSidebarIsOpen,
	...props
}: HeaderProps) {
	return (
		<HStack
			p="5"
			borderBottom="1px solid var(--chakra-colors-gray-200)"
			justify="space-between"
			{...props}
		>
			<HStack align="center">
				<IconButton
					colorScheme="gray"
					className="hamburger"
					icon={<IconMenu2 size="20px" />}
					variant="ghost"
					aria-label="Menu"
					onClick={() => {
						setSidebarIsOpen(1)
					}}
				/>
				<Heading color="gray.600" size="md" children={activeNav.label} />
			</HStack>

			{activeNav.showChangeDahshButton && <ChangeActiveDashboard />}
		</HStack>
	);
}
