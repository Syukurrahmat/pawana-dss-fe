import { fetcher } from '@/utils/fetcher';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import qs from 'qs';
import { useState } from 'react';
import useSWR from 'swr';
import DisplayData from './displayData';
import { FormSelectNode } from './FormSelectNode';

export type NodeWithDateRange = {
	nodeId: number;
	startDate: Date;
	endDate: Date;
};

export default function DownloadData() {
	const [nodeWithDateRange, setNodeWithDateRange] =
		useState<NodeWithDateRange>({
			nodeId: NaN,
			startDate: new Date(),
			endDate: new Date(),
		});

	const { nodeId, ...queryParams } = nodeWithDateRange;
	const apiUrl = nodeId
		? `/nodes/${nodeId}/datalogs?${qs.stringify(queryParams)}`
		: null;

	const { data, isLoading } = useSWR<DownloadDataResponse>(apiUrl, fetcher);

	return (
		<Box>
			<Heading size="lg">Akses data yang dikirim dari node</Heading>
			<Text color='dimmed'>Pilih node dan unduh data untuk analisis secara mandiri</Text>

			<Container maxW="container.md" as={VStack} spacing="4" mt="6" p="0">
				<FormSelectNode
					selectedDataState={[nodeWithDateRange, setNodeWithDateRange]}
				/>
				<DisplayData data={data} isLoading={isLoading} />
			</Container>
		</Box>
	);
}
