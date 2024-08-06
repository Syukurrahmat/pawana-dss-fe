import { companyTypeAttr } from '@/constants/enumVariable';
import {
	Avatar,
	Box,
	BoxProps,
	Center,
	HStack,
	Icon,
	Text,
} from '@chakra-ui/react';
import { IconPhone } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface IManagerCard extends BoxProps {
	data: Partial<UserData>;
	label: string;
}

export default function UserCard({ data, label, ...rest }: IManagerCard) {
	return (
		<Link to={'../users/' + data.userId}>
			<HStack
				spacing="3"
				shadow="xs"
				rounded="md"
				overflow="hidden"
				py="3"
				px="4"
				bg="gray.50"
				position="relative"
				{...rest}
			>
				<Text
					pos="absolute"
					right="0"
					top="0"
					px="3"
					py="0.5"
					bg="gray.100"
					fontSize="sm"
					fontWeight="700"
					roundedBottomStart="md"
					textTransform="uppercase"
					children={label}
				/>
				<Avatar name={data.name} rounded="md" />
				<Box pr="90px">
					<Text fontSize="lg" fontWeight="600">
						{data.name}
					</Text>
					<HStack spacing="2">
						<IconPhone size="16" />
						<Text>{data.phone}</Text>
					</HStack>
				</Box>
			</HStack>
		</Link>
	);
}

export function CompanyCard({
	data,
	...rest
}: { data: Partial<CompanyData> } & BoxProps) {
	const { icon, name, color } = companyTypeAttr[data.type!]

	return (
		<Link to={'../companies/' + data.companyId}>
			<HStack
				spacing="3"
				shadow="xs"
				rounded="md"
				overflow="hidden"
				py="3"
				px="4"
				bg="gray.50"
				position="relative"
				{...rest}
			>
				<Text
					pos="absolute"
					right="0"
					top="0"
					px="3"
					py="0.5"
					bg="gray.100"
					fontSize="sm"
					fontWeight="700"
					roundedBottomStart="md"
					textTransform="uppercase"
					children="Pemilik"
				/>
				<Center p="2" rounded="md" bg={color + '.100'}>
					<Icon as={icon} boxSize="28px" />
				</Center>

				<Box pr="90px">
					<Text fontSize="lg" fontWeight="600">
						{data.name}
					</Text>
					<HStack spacing="2">
						<Text>{name}</Text>
					</HStack>
				</Box>
			</HStack>
		</Link>
	);
}
