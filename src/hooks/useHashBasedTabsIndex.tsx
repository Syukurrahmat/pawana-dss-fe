import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type useHashBasedTabsIndex = ( hashTabs: string[]) => [number, (i: number) => void]; //prettier-ignore

export const useHashBasedTabsIndex: useHashBasedTabsIndex = (hashTabs) => {
	const location = useLocation();
	const navigate = useNavigate();

	const [tabIndex, setTabIndex] = useState(-1);

	useEffect(() => {
		const index = hashTabs.indexOf(location.hash.slice(1));
		setTabIndex(index == -1 ? 0 : index);
	}, [location]);

	const handleTabsChange = (i: number) => {
		setTabIndex(i);
		navigate('#' + hashTabs[i]);
	};

	return [tabIndex, handleTabsChange];
};
