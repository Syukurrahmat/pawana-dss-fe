import { Heading, HStack, Image, StackProps } from '@chakra-ui/react';
import logo from '../../assets/icon.svg';

export default function Logo(props: StackProps) {
	return (
		<HStack px="2" {...props}>
			<Image src={logo} h="30px" />
			<Heading fontSize="2xl">AtmosEye</Heading>
		</HStack>
	);
}
