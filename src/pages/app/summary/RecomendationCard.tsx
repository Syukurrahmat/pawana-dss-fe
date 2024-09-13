import { responsiveCardSize } from '@/utils/common.utils';
import { Button, Card, CardBody, CardHeader, CardProps, Center, Collapse, Divider, Icon, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconBulb, IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export default function RecomendationCard(props: CardProps) {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Card size={responsiveCardSize} shadow="xs" flexGrow="1">
			<CardHeader
				as={Button}
				onClick={onToggle}
				variant="ghost"
				py="8"
				colorScheme="white"
				justifyContent="start"
				alignItems="center"
				w="full"
				size="lg"
				iconSpacing="12px"
				leftIcon={
					<Center bg="orange.200" p="1.5" rounded="lg">
						<Icon as={IconBulb} boxSize="20px" color="orange.600" />
					</Center>
				}
				rightIcon={
					<Icon
						boxSize="20px"
						as={!isOpen ? IconChevronDown : IconChevronUp}
					/>
				}
				children="Rekomendasi"
			/>
			<Collapse in={isOpen} animateOpacity>
				<Divider />
				<CardBody pt='4'>{props.children}</CardBody>
			</Collapse>
		</Card>
	);
}
