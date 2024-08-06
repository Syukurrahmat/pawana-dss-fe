import logo from '@/assets/icon.svg';
import {
    Center,
    Container,
    HStack,
    Heading,
    Image,
    Progress,
} from '@chakra-ui/react';

export default function PreLoadScreen() {
	return (
		<Container
			maxW="full"
			as={Center}
			flexDir="column"
			pb="70px"
			bg="#378CE7"
			minH="100vh"
		>
			<HStack>
				<Center rounded="lg" boxSize="50px" bg="gray.50">
					<Image src={logo} />
				</Center>
				<Heading size="2xl" color="gray.50">
					AtmosEye
				</Heading>
			</HStack>

			<Progress
				mt="8"
				outline="3px solid"
				outlineColor="gray.100"
				w="300px"
				isIndeterminate
				rounded="md"
			/>
		</Container>
	);
}
