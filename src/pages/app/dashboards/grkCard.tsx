import { Alert, Button, Flex, HStack, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import GaugeChart from 'react-gauge-chart';
import {
	IconArrowBarRight,
	IconBuildingFactory,
	IconHistory,
} from '@tabler/icons-react';

import TinyChart from './tinyChart';
import CardTinyTitle from '../../../components/cardWithTinyTitle';

export default function GRKCard() {
	return (
		<CardTinyTitle title="Metana" bgTitle="cyan.300">
			<Flex px="6">
				<VStack w="150px" spacing="1">
					<HStack color="gray.600">
						<IconBuildingFactory width="1.2em" />
						<Text>Dalam Pabrik</Text>
					</HStack>
					<GaugeChart
						nrOfLevels={420}
						arcsLength={[0.3, 0.5, 0.2]}
						colors={['#5BE12C', '#F5CD19', '#EA4228']}
						percent={0.37}
						arcPadding={0.02}
						hideText={true}
					/>
					<Text fontSize="2xl" fontWeight="600" children="230 PPM" />
					<Tag
						size="md"
						fontSize="md"
						justifyContent="center"
						w="80%"
						colorScheme="green"
						children="AMAN"
					/>
				</VStack>
				<VStack w="150px" spacing="1">
					<HStack color="gray.600">
						<IconBuildingFactory width="1.2em" />
						<Text>Dalam Pabrik</Text>
					</HStack>
					<GaugeChart
						nrOfLevels={420}
						arcsLength={[0.3, 0.5, 0.2]}
						colors={['#5BE12C', '#F5CD19', '#EA4228']}
						percent={0.37}
						arcPadding={0.02}
						hideText={true}
					/>
					<Text fontSize="2xl" fontWeight="600" children="230 PPM" />
					<Tag
						size="md"
						fontSize="md"
						justifyContent="center"
						w="80%"
						colorScheme="green"
						children="AMAN"
					/>
				</VStack>
			</Flex>
			<TinyChart />
			<Alert rounded="sm" status="success" variant="left-accent">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
				maiores aliquam commodi aut animi pariatur rem eos quos at fugiat!
			</Alert>
			<HStack mt="3" justify="space-between">
				<HStack fontSize="sm" color="gray.600">
					<IconHistory width="18px" />
					<Text>Diperbarui 1 menit yang lalu</Text>
				</HStack>
				<Button
					size="sm"
					leftIcon={<IconArrowBarRight width="20px" />}
					colorScheme="teal"
					children="Detail"
				/>
			</HStack>
		</CardTinyTitle>
	);
}
