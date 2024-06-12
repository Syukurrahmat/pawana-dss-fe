import { Text, Box, Heading, HStack } from '@chakra-ui/react';
import LoadingAnimation from './LoadingAnimation';

export default function LoadingComponent() {
	return (
		<HStack w="full" justifyContent="center" spacing="5" pb="40">
			<LoadingAnimation />

			<Box color="gray.500">
				<Heading size="lg">Mengambil Data</Heading>
				<Text>Harap tunggu sebentar </Text>
			</Box>
		</HStack>
	);
}
