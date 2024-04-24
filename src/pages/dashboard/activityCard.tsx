import { Box, Card, CardBody, CardHeader, Center, HStack, IconButton, Spacer, Square, StackDivider, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconActivity, IconChevronRight, IconProgress } from '@tabler/icons-react'; // prettier-ignore

export default function ActivityCard() {
	return (
		<Card w="500px">
			<CardHeader as={HStack} spacing="4" pb="1">
				<Square bg="gray.100" p="0.5" rounded="md">
					<IconActivity />
				</Square>
				<Text fontSize="lg" fontWeight="600" as="p">
					Aktivitas Terkini
				</Text>
			</CardHeader>
			<CardBody
				as={VStack}
				spacing="3"
				align="start"
				divider={<StackDivider borderColor="gray.200" />}
			>
				<HStack spacing="4" w="full">
					<Center boxSize="40px" bg="yellow.200" rounded="lg">
						<IconProgress />
					</Center>
					<Box>
						<Text fontWeight="medium">Lorem ipsum dolor</Text>
						<Text fontSize="sm">23 Jan - Sekarang</Text>
					</Box>
					<Spacer />
					<IconButton
						aria-label="Detail"
						variant="ghost"
						icon={<IconChevronRight />}
					/>
				</HStack>
				<HStack spacing="4" w="full">
					<Center boxSize="40px" bg="yellow.200" rounded="lg">
						<IconProgress />
					</Center>
					<Box>
						<Text fontWeight="medium">Lorem ipsum dolor</Text>
						<Text fontSize="sm">23 Jan - Sekarang</Text>
					</Box>
					<Spacer />
					<IconButton
						aria-label="Detail"
						variant="ghost"
						icon={<IconChevronRight />}
					/>
				</HStack>
				<HStack spacing="4" w="full">
					<Center boxSize="40px" bg="yellow.200" rounded="lg">
						<IconProgress />
					</Center>
					<Box>
						<Text fontWeight="medium">Lorem ipsum dolor</Text>
						<Text fontSize="sm">23 Jan - Sekarang</Text>
					</Box>
					<Spacer />
					<IconButton
						aria-label="Detail"
						variant="ghost"
						icon={<IconChevronRight />}
					/>
				</HStack>
				<HStack spacing="4" w="full">
					<Center boxSize="40px" bg="yellow.200" rounded="lg">
						<IconProgress />
					</Center>
					<Box>
						<Text fontWeight="medium">Lorem ipsum dolor</Text>
						<Text fontSize="sm">23 Jan - Sekarang</Text>
					</Box>
					<Spacer />
					<IconButton
						aria-label="Detail"
						variant="ghost"
						icon={<IconChevronRight />}
					/>
				</HStack>
				<HStack spacing="4" w="full">
					<Center boxSize="40px" bg="yellow.200" rounded="lg">
						<IconProgress />
					</Center>
					<Box>
						<Text fontWeight="medium">Lorem ipsum dolor</Text>
						<Text fontSize="sm">23 Jan - Sekarang</Text>
					</Box>
					<Spacer />
					<IconButton
						aria-label="Detail"
						variant="ghost"
						icon={<IconChevronRight />}
					/>
				</HStack>
				<HStack spacing="4" w="full">
					<Center boxSize="40px" bg="yellow.200" rounded="lg">
						<IconProgress />
					</Center>
					<Box>
						<Text fontWeight="medium">Lorem ipsum dolor</Text>
						<Text fontSize="sm">23 Jan - Sekarang</Text>
					</Box>
					<Spacer />
					<IconButton
						aria-label="Detail"
						variant="ghost"
						icon={<IconChevronRight />}
					/>
				</HStack>
			</CardBody>
		</Card>
	);
}
