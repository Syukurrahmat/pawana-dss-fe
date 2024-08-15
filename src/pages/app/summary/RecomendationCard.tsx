import { Button, Card, CardBody, CardHeader, CardProps, Center, Collapse, Divider, Icon, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import {
	IconBulb,
	IconChevronDown,
	IconChevronUp
} from '@tabler/icons-react';

export default function RecomendationCard(props: CardProps) {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Card size="sm" p="1" shadow="xs" flexGrow="1">
			<CardHeader
				as={Button}
				fontWeight="600"
				fontSize="lg"
				onClick={onToggle}
				variant="ghost"
				py="7"
				colorScheme="white"
				justifyContent="start"
				w="full"
				leftIcon={
					<Center bg="orange.200" p="1.5" rounded="lg" >
						<Icon as={IconBulb} boxSize="22px" color="orange.600" />
					</Center>
				}
				rightIcon={
					<Icon
						boxSize="20px"
						as={!isOpen ? IconChevronDown : IconChevronUp}
					/>
				}
			>
				Rekomendasi
			</CardHeader>
			<Collapse in={isOpen} animateOpacity>
				<Divider />
				<CardBody py="2">{props.children}</CardBody>
			</Collapse>
		</Card>
	);
}
