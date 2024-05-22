import {
	Center,
	Spinner,
	Text,
	Box,
	Heading,
	VStack,
	Image,
} from '@chakra-ui/react';
import loadingGif from '@/assets/loading-anim.gif';

export default function LoadingAnimation() {
	return (
		<VStack w="full" justifyContent="center" spacing="5" pb='40' >
			<Image rounded="lg" boxShadow="sm" boxSize="150px" src={loadingGif} />
			<Box textAlign='center' color='gray.500'>
				<Heading size="lg">Mengambil Data</Heading>
				<Text>Harap tunggu sebentar </Text>
			</Box>
		</VStack>
	);
}
