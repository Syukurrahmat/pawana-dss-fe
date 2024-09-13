import {
	Heading,
	Spinner,
	Stack,
	Text,
	VStack
} from '@chakra-ui/react';

export default function LoadingComponent() {
	return (
		<Stack
			w="full"
			direction={{ base: 'column', sm: 'row' }}
			justifyContent="center"
			align="center"
			spacing="6"
			pb="40"
		>
			<Spinner
				thickness="5px"
				speed="0.65s"
				emptyColor="gray.200"
				color="blue.500"
				boxSize="58px"
			/>
			<VStack spacing='0' align={{base : 'center', sm : 'start'}} color="gray.500" >
				<Heading size="lg" fontWeight='600'>Mengambil Data</Heading>
				<Text>Harap tunggu sebentar </Text>
			</VStack>
		</Stack>
	);
}
//
