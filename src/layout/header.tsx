import { Box, BoxProps, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps extends BoxProps {
	navbarList: {
		Icon: React.ForwardRefExoticComponent<any>;
		label: string;
		path: string;
	}[];
}

export default function Header({ navbarList, ...props }: HeaderProps) {
	const [headerText, setHeaderText] = useState<string | undefined>('');
	let location = useLocation();

	useEffect(() => {
		setHeaderText(
			navbarList.find((e) => e.path == '/' + location.pathname.split('/')[1])
				?.label
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
