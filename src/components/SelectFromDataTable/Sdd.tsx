import useUser from '@/hooks/useUser';
import { ButtonProps, HStack, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2 } from '@tabler/icons-react';
import CompanyIcon from '../common/CompanyIcon';
import SelectFromDataTable from './SelectFromDataTable';

interface FindCompanies extends ButtonProps {
	_value?: Record<string, any>;
	_onChange: (v: Record<string, any>) => any;
}

export function SelectFromDataTableCompanies({
	_value,
	_onChange,
	...rest
}: FindCompanies) {
	const { roleIs, user } = useUser();

	const findCompaniesURL = roleIs(['admin', 'gov'])
		? '/companies?view=simple'
		: `/users/${user.userId}/companies?view=simple`;

	return (
		<SelectFromDataTable
			leftIcon={<IconBuildingFactory2 size="30" />}
			itemName="Usaha"
			_value={_value}
			_onChange={_onChange}
			apiUrl={findCompaniesURL}
			displayRow={(e: any) => (
				<HStack>
					<CompanyIcon bg="white" type={e.type} />
					<Text children={e?.name || 'Node yang Anda ikuti'} />
				</HStack>
			)}
			{...rest}
		/>
	);
}
