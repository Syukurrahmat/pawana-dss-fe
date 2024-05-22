import { companyTypeAttr } from '@/constants/enumVariable';
import { Center, Icon } from '@chakra-ui/react';

interface ICompanyIcon {
	type: string;
	size?: string;
}
export default function CompanyIcon({ type, size = '18px' }: ICompanyIcon) {
	const { color, icon } = companyTypeAttr[type];
	return (
		<Center
			rounded="md"
			border="2px solid"
			borderColor={color + '.200'}
			color={color + '.500'}
			p="2"
		>
			<Icon as={icon} boxSize={size} />
		</Center>
	);
}
