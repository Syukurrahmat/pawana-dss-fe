import { HStack, Heading, HeadingProps, Icon } from '@chakra-ui/react';
import { IconAddressBook } from '@tabler/icons-react';
import { ReactElement } from 'react';

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
			{IconEl && <Icon as={IconEl} boxSize="18px" />}
			<Heading fontSize="lg" fontWeight="600" {...rest} />
		</HStack>
	);
}
