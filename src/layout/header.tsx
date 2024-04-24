import { Box, BoxProps, Divider, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps extends BoxProps {}

export default function Header({ ...props }: HeaderProps) {
	const [headerText, setHeaderText] = useState<String[]>(['', '']);

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
	};

	let location = useLocation();

	useEffect(() => {
		setHeaderText(headerTextList['/' + location.pathname.split('/')[1]]);
	}, [location.pathname]);

	return (
		<Box p="5" {...props}>
			<Heading fontSize="2xl" children={headerText[0]} />
			<Text color="gray.500" children={headerText[1]} />
			<Divider mt='3'/>
		</Box>
	);
}
