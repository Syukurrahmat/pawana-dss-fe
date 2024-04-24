import { Card, CardBody, CardHeader } from '@chakra-ui/react'; // prettier-ignore
import { BoxProps } from '@chakra-ui/react';

interface CardTinyTitleProps extends BoxProps {
	title: string;
	bgTitle: string;
}

export default function CardTinyTitle({
	title,
	bgTitle,
	children,
}: CardTinyTitleProps) {
	return (
		<Card overflow="hidden" w="min-content">
			<CardHeader
				py="0.5"
				px="10"
				fontSize="lg"
				fontWeight="500"
				borderEndEndRadius="8px "
				bg={bgTitle}
				w="max-content"
				children={title}
			/>
			<CardBody>{children}</CardBody>
		</Card>
	);
}
