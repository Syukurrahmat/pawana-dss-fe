import SelectGroup from '@/components/common/SelectGroupInput';
import { API_URL } from '@/constants/config';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import {
	IconBuildingFactory2,
	IconCircleDot,
	IconSend2,
} from '@tabler/icons-react';
import { RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';
import { Range } from 'react-date-range';
import SelectAirParams, { airParameters } from './selectAirParams';
import SelectDateRange from './selectDateRange';
import { buildQueriesURL } from '@/utils/index.utils';
import axios from 'axios';

const rowSelectionStateParse = (r: RowSelectionState) => {
	return Object.keys(r).map((e) => e.split('-')[0])[0];
};

export default function Data() {
	const [selectedGroup, setSelectedGroup] = useState<RowSelectionState>({});
	const [selectedNode, setSelectedNode] = useState<RowSelectionState>({});
	const [airParams, setAirParams] = useState(
		Array.from({ length: airParameters.length }, () => false)
	);
	const [dateRange, setDateRange] = useState<Range>({
		startDate: new Date(),
		endDate: new Date(),
		key: 'selection',
	});

	const groupId = rowSelectionStateParse(selectedGroup);
	const nodeId = rowSelectionStateParse(selectedNode);
	const selectedAirParams = airParams
		.map((e, i) => (e ? airParameters[i] : null))
		.filter((e) => e)
		.join(',');

	const onSubmitHandler = () => {
		axios.get(
			buildQueriesURL(`${API_URL}/nodes/${nodeId}/data`, {
				params: selectedAirParams,
				start: dateRange.startDate?.toISOString(),
				end: dateRange.endDate?.toISOString(),
			})
		).then(e=>alert('oke'))
	};

	return (
		<>
			<Heading size="lg">Akses data yang dikirim dari Node</Heading>
			<Text>
				Pilih Grup yang Anda ikut, lalu pilih node mana yang hendak diakses,
			</Text>
			<Flex mt="8" gap="4">
				<SelectGroup
					flexGrow={1}
					placeholder="Pilih Grup"
					Icon={IconBuildingFactory2}
					itemName="grup"
					itemIdKey="groupId"
					apiUrl={`${API_URL}/search/groups`}
					externalState={[
						selectedGroup,
						(e) => {
							setSelectedNode({});
							setSelectedGroup(e);
						},
					]}
				/>

				<SelectGroup
					flexGrow={1}
					isDisabled={!groupId}
					placeholder="Pilih Node"
					Icon={IconCircleDot}
					itemName="node"
					itemIdKey="nodeId"
					apiUrl={`${API_URL}/search/groups/${groupId}/nodes`}
					externalState={[selectedNode, setSelectedNode]}
				/>
				<SelectAirParams flexGrow={1} state={[airParams, setAirParams]} />

				<SelectDateRange flexGrow={1} state={[dateRange, setDateRange]} />
				<Button
					isDisabled={!(groupId && nodeId && selectedAirParams.length)}
					flexGrow={1}
					py="8"
					size="lg"
					fontSize="md"
					shadow="xs"
					border="0px solid"
					bg="gray.50"
					colorScheme="blue"
					variant="outline"
					rightIcon={<IconSend2 size="20" />}
					onClick={onSubmitHandler}
				>
					Dapatkan data
				</Button>
			</Flex>
		</>
	);
}
