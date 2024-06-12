import { HStack, Text, ButtonProps } from '@chakra-ui/react';
import CompanyIcon from '@/components/common/CompanyIcon';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { mutate } from 'swr';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';

export function ChangeActiveDashboard(props: ButtonProps) {
	const { user, mutateUser } = useUser();

	const selectOnChange = async (activeDashboard: any) => {
		const resp = await axios.put(API_URL + '/me/active-dashboard', {
			companyId: activeDashboard?.companyId,
		});
		
		if (resp.status !== 200) return;

		mutateUser(e=>({...e, ...resp.data}));
		mutate((e) => typeof e == 'string' && e.startsWith('/dashboard'), null, {
			revalidate: true,
		});
	};

	return (
		<SelectFromDataTable
			dtMaxH="300px"
			itemName="Usaha"
			hiddenTitleButton={true}
			apiUrl="/me/companies?includeUserSubs=true"
			selectValue={user.activeCompany || {type : 'regular'}}
			selectOnChange={selectOnChange}
			hiddenSearchInput={true}
			displayRow={(e) => (
				<HStack>
					<CompanyIcon bg="white" type={e.type} />
					<Text children={e?.name || 'Node yang Anda ikuti'} />
				</HStack>
			)}
			{...props}
		/>
	);
}
