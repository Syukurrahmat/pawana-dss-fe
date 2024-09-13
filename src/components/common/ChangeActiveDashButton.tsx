import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/SelectFromDataTable/SelectFromDataTable';
import useUser, { User } from '@/hooks/useUser';
import { myAxios } from '@/utils/fetcher';
import { Button, ButtonProps, HStack, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconChartBar, IconChevronDown, IconUser } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyedMutator } from 'swr';
import NameWithAvatar from './NamewithAvatar';

interface ViewDashboard extends ButtonProps {
	companyId?: number;
	userId?: number;
}

type ChangeDash = (
	m: KeyedMutator<User>,
	c: { companyId: number } | { userId: number } | null
) => any;

export const changeDashboard: ChangeDash = async (mutateUser, data) => {
	myAxios.patch('/app/configure-view', data).then((resp) => {
		if (resp.status === 200) {
			mutateUser((e) => ({ ...e, ...resp.data.data }));
		}
	});
};

export function ButtonViewDashboard({
	companyId,
	userId,
	...r
}: ViewDashboard) {
	const { mutateUser } = useUser();
	const navigate = useNavigate();
	const [isLoading, setIsloading] = useState(false);

	if (!companyId && !userId) return null;

	const onClickHandler = async () => {
		setIsloading(true);

		await changeDashboard(
			mutateUser,
			companyId ? { companyId } : userId ? { userId } : null
		);
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

interface ChangeActiveDashboard extends ButtonProps {
	selectCompanyOnly?: boolean;
}

export function ChangeActiveDashboard({
	selectCompanyOnly = true,
	...props
}: ChangeActiveDashboard) {
	const { user, roleIs, mutateUser } = useUser();

	const isAdmin = roleIs(['admin', 'gov']);

	const companiesApiUrl = isAdmin
		? `/companies?view=simple`
		: `/users/${user.userId}/companies?view=simple`;

	const propsWhenInMenu = {
		variant: 'ghost',
		bg: 'none',
		w: 'full',
		rightIcon: undefined,
		rounded: '0',
		iconSpacing: '3',
		py: '6',
		colorScheme: 'gray',
		fontWeight: '500',
	};

	const SelectCompany = (props: any) => (
		<SelectFromDataTable
			dtMaxH="300px"
			itemName="Perusahaan"
			hiddenTitleButton={true}
			apiUrl={companiesApiUrl}
			_value={user.view!.company!}
			_onChange={(e: any) =>
				changeDashboard(mutateUser, { companyId: e.companyId })
			}
			hiddenSearchInput={!isAdmin}
			displayRow={(e) => (
				<HStack>
					<CompanyIcon bg="white" type={e.type} />
					<Text children={e?.name} />
				</HStack>
			)}
			{...props}
		/>
	);

	const SelectPublicUser = (props: any) => (
		<SelectFromDataTable
			dtMaxH="300px"
			itemName="Pengguna Publik"
			hiddenTitleButton={true}
			apiUrl="/users?role=regular&view=simple"
			_value={user.view!.user!}
			_onChange={(e: any) => {
				changeDashboard(mutateUser, { userId: e.userId });
			}}
			hiddenSearchInput={!isAdmin}
			displayRow={(e) => <NameWithAvatar name={e.name} />}
			{...props}
		/>
	);

	if (!selectCompanyOnly && roleIs(['admin', 'gov'])) {
		return (
			<Menu>
				{({ isOpen }) => (
					<>
						<MenuButton
							isActive={isOpen}
							as={Button}
							variant="outline"
							colorScheme="blue"
							rightIcon={<IconChevronDown />}
							{...props}
						/>
						<MenuList>
							<MenuItem p="0">
								<SelectCompany
									leftIcon={
										<Icon
											as={IconBuildingFactory2}
											boxSize="22px"
											color="blue.600"
										/>
									}
									{...propsWhenInMenu}
									children="Dashboard Perusahaan"
								/>
							</MenuItem>
							<MenuItem p="0">
								<SelectPublicUser
									leftIcon={
										<Icon
											as={IconUser}
											boxSize="22px"
											color="green.600"
										/>
									}
									{...propsWhenInMenu}
									children="Dashboard Pengguna Publik"
								/>
							</MenuItem>
						</MenuList>
					</>
				)}
			</Menu>
		);
	}

	return <SelectCompany {...props} />;
}
