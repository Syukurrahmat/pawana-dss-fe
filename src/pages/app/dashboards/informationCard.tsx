import { ChangeActiveDashboard } from "@/components/common/ChangeActiveDashButton";
import { Box, Button, Card, CardBody, CardHeader, CardProps, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { IconBuildingFactory2, IconInfoHexagon, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const InformationCard = (props: CardProps) => (
	<Box>
		<Card>
			<CardHeader pb="0">
				<HStack>
					<Icon as={IconInfoHexagon} color="blue.600" boxSize="28px" />
					<Heading size="md" children={'Informasi'} />
				</HStack>
			</CardHeader>

			<CardBody>{props.children}</CardBody>
		</Card>
	</Box>
);
export const SelectUserOrCompanyView = ({ withCard = true }) => (
	<Box as={withCard ? InformationCard : undefined}>
		<Text>Pilih Pengguna publik atau usaha yang ingin Anda Lihat</Text>
		<HStack mt="4">
			<ChangeActiveDashboard >Lihat Dasbor Perusahaan</ChangeActiveDashboard>
			<ChangeActiveDashboard >Lihat Dasbor Pengguna Publik</ChangeActiveDashboard>
		</HStack>
	</Box>
);
export const DontHaveCompany = ({ role }: { role: UserRole; }) => {
	const pronouns = role == 'manager' ? 'Anda ' : 'Pengguna Ini ';

	return (
		<InformationCard>
			<VStack align="start">
				<HStack
					border="2px solid"
					borderColor="gray.200"
					p="2"
					rounded="md"
				>
					<Icon
						as={IconBuildingFactory2}
						color="gray.500"
						boxSize="30px" />
					<Heading size="lg" color="gray.500" fontWeight="600" pr="2">
						{pronouns} belum memiliki Usaha
					</Heading>
				</HStack>
				{role !== 'gov' && (
					<>
						<Text maxW="md">
							Tambahkan Usaha sekarang untuk mendapatkan rekomendasi
							keputusan untuk usaha {pronouns}
						</Text>
						<Link to="/companies/create">
							<Button
								leftIcon={<IconPlus size="20px" />}
								colorScheme="green"
								children="Tambah Usaha" />
						</Link>
					</>
				)}
			</VStack>
		</InformationCard>
	);
};
