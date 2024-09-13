import { getISPUProperties } from '@/utils/common.utils';
import { HStack, Icon, Spacer, Stack, Tag, Text, VStack } from '@chakra-ui/react'; // prettier-ignore
import { IconCircleDot, IconHistory } from '@tabler/icons-react';
import { FinalISPUCard, ISPUCannotAnalize } from './SingleNodeISPU';
import moment from 'moment';

interface MultiNodeISPU {
	data: NodeStat<ISPUValue>;
}

export default function MultiNodeISPU({ data }: MultiNodeISPU) {
	const { highest, lowest, average } = data;

	const highestIspuData = highest.data.value?.[0];
	const lowestIspuData = lowest.data.value?.[0];

	const { value, datetime } = average.data;

	if (!value || !highestIspuData || !lowestIspuData)
		return <ISPUCannotAnalize />;

	const minMaxValues = [
		{ nodeName: highest.name, ispuData: highestIspuData },
		{ nodeName: lowest.name, ispuData: lowestIspuData },
	];

	return (
		<>
			<FinalISPUCard value={value[0]} />

			<Stack
				wrap="wrap"
				direction="row"
				spacing="4"
				align="stretch"
				w="full"
				justifyContent="space-evenly"
			>
				{minMaxValues.map((e, i) => (
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

interface MinMaxISPU {
	data: {
		nodeName: string;
		ispuData: ISPUValueItem;
	};
	label: string;
}

function MinMaxISPU({ data, label }: MinMaxISPU) {
	const { category, ispu } = data.ispuData;
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
				<Text
					w="full"
					noOfLines={1}
					fontSize="sm"
					children={data.nodeName}
				/>
			</HStack>
		</VStack>
	);
}
