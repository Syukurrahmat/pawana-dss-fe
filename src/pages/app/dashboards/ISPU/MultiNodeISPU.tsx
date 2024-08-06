import { getISPUProperties } from '@/utils/common.utils';
import { HStack, Icon, Spacer, Stack, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCircleDot, IconHistory } from '@tabler/icons-react';
import { FinalISPUCard } from './SingleNodeISPU';
import moment from 'moment';

interface MultiNodeISPU {
	data: NodeStat<[ISPUValue, ISPUValue]>;
}

export default function MultiNodeISPU({ data }: MultiNodeISPU) {
	const { highest, lowest, average } = data;

	const { value, datetime } = average.data;

	return (
		<>
			<FinalISPUCard value={value[0]} />

			<Stack
				direction="row"
				spacing="4"
				w="full"
				justifyContent="space-evenly"
			>
				{[highest, lowest].map((e, i) => (
					<MinMaxISPU
						data={e}
						key={i}
						label={i ? 'Terendah' : 'Tertinggi'}
					/>
				))}
			</Stack>
			<Spacer />
			<HStack justify="end" w="full">
				<Icon as={IconHistory} boxSize="18px" />
				<Text>
					ISPU Pukul {moment(datetime).format('HH:mm DD MMM YYYY')}
				</Text>
			</HStack>
		</>
	);
}

interface NewType {
	data: {
		nodeId: number;
		name: string;
		lastDataSent: string;
		data: Timeseries<[ISPUValue, ISPUValue]>;
	};
	label: string;
}

function MinMaxISPU({ data, label }: NewType) {
	const { category, ispu } = data.data.value[0];
	const { colorScheme } = getISPUProperties(category);

	return (
		<VStack
			minW="200px"
			spacing="0"
			rounded="md"
			align="start"
			px="4"
			py="3"
			justify="center"
			bg={colorScheme + '.100'}
		>
			<Text fontWeight="500">{label}</Text>
			<HStack w="full" justify="space-between">
				<Text
					fontSize="2xl"
					fontWeight={700}
					children={ispu <= 300 ? ispu : '300+'}
				/>
				<Tag bg={colorScheme + '.300'} children={category} />
			</HStack>
			<HStack spacing="1">
				<IconCircleDot size="16" />
				<Text w="full" noOfLines={1} fontSize="sm" children={data.name} />
			</HStack>
		</VStack>
	);
}
