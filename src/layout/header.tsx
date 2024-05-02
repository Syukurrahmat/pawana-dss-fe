import { Box, BoxProps, Divider, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps extends BoxProps {}
const headerTextList: any = {
	'/': ['Dashboard'],
	'/analysis': ['Analysis'],
	'/data': ['Data'],
	'/group': ['Grup'],
	'/activity': ['Aktivitas'],
	'/users': ['Manajemen Pengguna'],
	'/groups': ['Manajemen Grup'],
	'/nodes': ['Manajemen Node'],
};
export default function Header({ ...props }: HeaderProps) {
	const [headerText, setHeaderText] = useState<String[]>(['', '']);
	let location = useLocation();

	useEffect(() => {
		setHeaderText(headerTextList['/' + location.pathname.split('/')[1]]);
	}, [location.pathname]);

	return (
		<Box
			p="5"
			borderBottom="1px solid var(--chakra-colors-gray-200)"
			{...props}
		>
			<Heading color="gray.600" size="md" children={headerText[0]} />
		</Box>
	);
}
