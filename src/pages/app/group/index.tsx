import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, Text, VStack} from '@chakra-ui/react'; // prettier-ignore
import { IconAddressBook, IconBuildingFactory2, IconLocationCheck, IconUsersGroup} from '@tabler/icons-react'; // prettier-ignore

export default function Group() {
	return (
		<VStack align="start" spacing="4">
			<Box>
				<Heading mb="1" size="md">
					Grup Saya
				</Heading>
				<Text>
					Dolor sit amet consectetur adipisicing elit. Dicta quis velit
					aliquid iste ea assumenda ut exercitationem labore, enim dolore?
				</Text>
			</Box>
			<Flex flexWrap="wrap" gap="4">
				<GroupCard />
				<GroupCard />
			</Flex>
			<Box>
				<Heading mb="1" size="md">
					Grup Diikuti
				</Heading>
				<Text>
					Dolor sit amet consectetur adipisicing elit. Dicta quis velit
					aliquid iste ea assumenda ut exercitationem labore, enim dolore?
				</Text>
			</Box>
			<Flex flexWrap="wrap" gap="4">
				<GroupCard />
				<GroupCard />
				<GroupCard />
				<GroupCard />
				<GroupCard />
				<GroupCard />
				<GroupCard />
				<GroupCard />
			</Flex>
		</VStack>
	);
}
function GroupCard() {
	return (
		<Card overflow="hidden" maxW="350px">
			<CardHeader
				as={HStack}
				py="3"
				justify="center"
				bg="blue.400"
				color="white"
			>
				<IconBuildingFactory2 />
				<Text fontWeight="600" fontSize="lg">
					Fabrik Sukareja
				</Text>
			</CardHeader>
			<CardBody as={VStack} align="start">
				<Flex align="start" gap="4">
					<IconAddressBook
						style={{ flexShrink: 0, marginTop: '3px' }}
						size="20px"
						color="gray"
					/>
					<Text>
						Lorem ipsum dolor sit amet consectetu rLorem ipsum dolor sit
						amet consectetu rLorem ipsum dolor sit amet consectetur.
					</Text>
				</Flex>
				<Flex align="start" gap="4">
					<IconUsersGroup
						style={{ flexShrink: 0, marginTop: '3px' }}
						size="20px"
						color="gray"
					/>
					<Text>30 Anggota</Text>
				</Flex>
				<Flex align="start" gap="4">
					<IconLocationCheck
						style={{ flexShrink: 0, marginTop: '3px' }}
						size="20px"
						color="gray"
					/>
					<Text>Lorem ipsum dolor sit amet consectetur.</Text>
				</Flex>
			</CardBody>
			<CardFooter as={HStack} justify="end" py="3">
				<Button size="sm">Lihat Dahsboard</Button>
				<Button size="sm" colorScheme="blue">
					Detail Grup
				</Button>
			</CardFooter>
		</Card>
	);
}
