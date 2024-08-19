import { ChangeActiveDashboard } from '@/components/common/ChangeActiveDashButton';
import { Box, Button, Card, CardBody, CardHeader, CardProps, HStack, Heading, Icon, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconBuildingFactory2, IconInfoHexagon, IconPlus } from '@tabler/icons-react'; //prettier-ignore
import { Link } from 'react-router-dom';

interface SelectUserOrCompanyView {
	withCard?: boolean;
	selectCompanyOnly?: boolean;
}

export function SelectUserOrCompanyView({
	withCard = true,
	selectCompanyOnly = true,
}: SelectUserOrCompanyView) {
	return (
		<Box as={withCard ? InformationCard : undefined}>
			<Text>
				Pilih perusahaan {selectCompanyOnly ? 'atau Pengguna publik' : ''}{' '}
				yang ingin Anda Lihat
			</Text>
			<ChangeActiveDashboard mt="4" selectCompanyOnly={selectCompanyOnly}>
				{selectCompanyOnly ? 'Pilih Perusahaan' : 'Pilih Dasbor'}
			</ChangeActiveDashboard>
		</Box>
	);
}

function InformationCard(props: CardProps) {
	return (
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
}
