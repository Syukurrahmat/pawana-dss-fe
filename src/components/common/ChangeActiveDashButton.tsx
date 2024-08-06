import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import { API_URL } from '@/constants/config';
import useUser, { User } from '@/hooks/useUser';
import { Button, ButtonProps, HStack, Text } from '@chakra-ui/react';
import { IconChartBar } from '@tabler/icons-react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyedMutator } from 'swr';

export const changeActiveDashboardHandler = async (
	mutateUser: KeyedMutator<User>,
	companyId: number
) => {
	const resp = await axios.put(API_URL + '/me/active-dashboard', {
		companyId,
	});

	if (resp.status !== 200) return;

	mutateUser((e) => ({ ...e, ...resp.data }));
};

interface ViewDashboard extends ButtonProps {
	companyId: number;
}

export function ButtonViewDashboard({ companyId, ...r }: ViewDashboard) {
	const { mutateUser } = useUser();
	const navigate = useNavigate()
	const [isLoading, setIsloading] = useState(false);

	const onClickHandler = async () => {
		setIsloading(true);

		await changeActiveDashboardHandler(mutateUser, companyId);
		setIsloading(false);
		navigate('/')
	};

	return (
		<Button
			isLoading={isLoading}
			colorScheme="green"
			leftIcon={<IconChartBar size="16" />}
			children="Dasbor"
			onClick={onClickHandler}
			{...r}
		/>
	);
}

export function ChangeActiveDashboard(props: ButtonProps) {
	const { user, mutateUser } = useUser();

	return (
		<SelectFromDataTable
			dtMaxH="300px"
			itemName="Usaha"
			hiddenTitleButton={true}
			apiUrl="/me/companies"
			selectValue={user.view!.company!}
			selectOnChange={(e: any) =>
				changeActiveDashboardHandler(mutateUser, e.companyId)
			}
			hiddenSearchInput={true}
			displayRow={(e) => (
				<HStack>
					<CompanyIcon bg="white" type={e.type} />
					<Text children={e?.name} />
				</HStack>
			)}
			{...props}
		/>
	);
}
