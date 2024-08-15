import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/SelectFromDataTable/SelectFromDataTable';
import useUser, { User } from '@/hooks/useUser';
import { myAxios } from '@/utils/fetcher';
import { Button, ButtonProps, HStack, Text } from '@chakra-ui/react';
import { IconChartBar } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyedMutator } from 'swr';

interface ViewDashboard extends ButtonProps {
	companyId: number;
}

type ChangeDash = (m: KeyedMutator<User>, c: number) => any;

export const changeDashboard: ChangeDash = async (mutateUser, companyId) => {
	myAxios.patch('/app/configure-view', { companyId }).then((resp) => {
		if (resp.status === 200) {
			mutateUser((e) => ({ ...e, ...resp.data.data }));
		}
	});
};

export function ButtonViewDashboard({ companyId, ...r }: ViewDashboard) {
	const { mutateUser } = useUser();
	const navigate = useNavigate();
	const [isLoading, setIsloading] = useState(false);

	const onClickHandler = async () => {
		setIsloading(true);

		await changeDashboard(mutateUser, companyId);
		setIsloading(false);
		navigate('/');
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
	const { user, roleIs, mutateUser } = useUser();

	const apiUrl = roleIs(['admin', 'gov'])
		? `/companies?view=simple`
		: `/users/${user.userId}/companies?view=simple`;

	return (
		<SelectFromDataTable
			dtMaxH="300px"
			itemName="Usaha"
			hiddenTitleButton={true}
			apiUrl={apiUrl}
			_value={user.view!.company!}
			_onChange={(e: any) => changeDashboard(mutateUser, e.companyId)}
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
