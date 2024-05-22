import { Avatar, Box, BoxProps, HStack, Text } from '@chakra-ui/react';
import { IconPhone } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface IManagerCard extends BoxProps {
	data: Partial<UserData>;
	label : string 
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
					textTransform='uppercase'
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
