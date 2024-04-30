import { Box, BoxProps, Divider, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps extends BoxProps {}
const headerTextList: any = {
	'/': [
		'Dashboard',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
	'/analysis': [
		'Analysis',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
	'/data': [
		'Data',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
	'/group': [
		'Grup',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
	'/activity': [
		'Aktivitas',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
	'/groups': [
		'Manajemen Grup',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
	'/users': [
		'Manajemen Pengguna',
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat, reprehenderit.',
	],
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
			borderBottom='1px solid var(--chakra-colors-gray-200)'
			{...props}
		>
			<Heading color='gray.600' size="md" children={headerText[0]} />
		</Box>
	);
}
