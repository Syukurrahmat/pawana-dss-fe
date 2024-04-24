import { Tabs, TabList, Tab, VStack } from '@chakra-ui/react'; // prettier-ignore
import { useEffect, useState } from 'react';
import { NavLink, Outlet, redirect, useLocation } from 'react-router-dom';

export default function Analysis() {
	let location = useLocation();
	const pathList = ['ispu', 'grk', 'iklimmikro'];
	const [tabIndex, setTabIndex] = useState(-1);

	useEffect(() => {
		let index = pathList.indexOf(location.pathname.split('/')[2]);
		if (index == -1) redirect('/analysis/ispu');
		else setTabIndex(index);
	}, [location]);

	return (
		<VStack align="start">
			<Tabs mb="2" size="md" isLazy w="full" index={tabIndex}>
				<TabList>
					<Tab as={NavLink} to="ispu" fontWeight="600">
						ISPU
					</Tab>
					<Tab as={NavLink} to="grk" fontWeight="600">
						Emisi GRK
					</Tab>
					<Tab as={NavLink} to="iklimmikro" fontWeight="600">
						Iklim Mikro
					</Tab>
				</TabList>
			</Tabs>
			<Outlet />
		</VStack>
	);
}
