import { HStack, Heading, HeadingProps, Icon } from '@chakra-ui/react';

interface ISectionTitle extends HeadingProps {
	IconEl?: any;
}

export default function SectionTitle({ IconEl, ...rest }: ISectionTitle) {
	return (
		<HStack
			mt="8"
			pb="2"
			mb="2"
			borderBottom="1px solid"
			borderColor="gray.300"
		>
			{IconEl && <Icon as={IconEl} boxSize="20px" />}
			<Heading fontSize="xl" fontWeight="500" {...rest} />
		</HStack>
	);
}
