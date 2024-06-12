import { companyTypeAttr } from '@/constants/enumVariable';
import { Center, Icon ,CenterProps} from '@chakra-ui/react';

interface ICompanyIcon extends CenterProps {
	type: string;
	size?: string;
}
export default function CompanyIcon({ type, size = '18px' ,...rest}: ICompanyIcon) {
	const { color, icon } = companyTypeAttr[type] || companyTypeAttr.other;
	return (
		<Center
			rounded="md"
			border="2px solid"
			borderColor={color + '.200'}
			color={color + '.500'}
			p="2"
			{...rest}
		>
			<Icon as={icon} boxSize={size} />
		</Center>
	);
}
