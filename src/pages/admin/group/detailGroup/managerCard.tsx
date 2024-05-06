import {
	Avatar,
	Box,
	BoxProps,
	Button,
	HStack,
	Spacer,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	IconInputAi,
	IconInputCheck,
	IconPhone,
	IconUserX,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface IManagerCard extends BoxProps {
	data: detailOfGroupData;
}

export default function ManagerCard({ data, ...rest }: IManagerCard) {
	if (!data.manager?.userId) {
		return (
			<Box
				shadow="xs"
				rounded="md"
				py="3"
				px="4"
				bg="gray.50"
				{...rest}
			>
				<Text fontWeight="700" color='gray.600'>MANAGER BELUM DITENTUKAN</Text>
				<Button
					mt='2'
					size="xs"
					leftIcon={<IconInputCheck size='18' />}
					colorScheme="blue"
					variant="outline"
				>
					Tentukan sekarang
				</Button>
			</Box>
		);
	}

	return (
		<Link to={'../users/' + data.manager.userId}>
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
					children="MANAGER"
				/>
				<Avatar name={data.manager.name} rounded="md" />
				<Box>
					<Text fontSize="lg" fontWeight="600">
						{data.manager.name}
					</Text>
					<HStack spacing="2" pr="90px">
						<IconPhone size="16" />
						<Text>{data.manager.phone}</Text>
					</HStack>
				</Box>
			</HStack>
		</Link>
	);
}
