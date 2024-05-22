import { Box, BoxProps, Divider, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navbarlList } from './sidebar';

interface HeaderProps extends BoxProps {}

export default function Header({ ...props }: HeaderProps) {
	const [headerText, setHeaderText] = useState<string | undefined>('');
	let location = useLocation();

	useEffect(() => {
		setHeaderText(
			navbarlList
				.flatMap((e) => e)
				.find((e) => e.path == '/' + location.pathname.split('/')[1])?.label
		);
	}, [location.pathname]);

	return (
		<Box
			p="5"
			borderBottom="1px solid var(--chakra-colors-gray-200)"
			{...props}
		>
			<Heading color="gray.600" size="md" children={headerText} />
		</Box>
	);
}
