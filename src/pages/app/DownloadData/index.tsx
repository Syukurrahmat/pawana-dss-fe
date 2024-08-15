import { fetcher } from '@/utils/fetcher';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import qs from 'qs';
import { useState } from 'react';
import useSWR from 'swr';
import DisplayData from './displayData';
import {
	FormSelectNodeForAdmin,
	FormSelectNodeForManager,
} from './FormSelectNode';
import useUser from '@/hooks/useUser';

export type NodeWithDateRange = {
	nodeId: number;
	startDate: Date;
	endDate: Date;
};

export default function DownloadData() {
	const { roleIs } = useUser();
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
			<Text>Pilih node dan unduh data untuk analisis secara mandiri</Text>

			<Container maxW="container.md" as={VStack} mt="8" p="0">
				{roleIs(['admin', 'gov']) ? (
					<FormSelectNodeForAdmin
						selectedDataState={[nodeWithDateRange, setNodeWithDateRange]}
					/>
				) : (
					<FormSelectNodeForManager
						selectedDataState={[nodeWithDateRange, setNodeWithDateRange]}
					/>
				)}
				<DisplayData data={data} isLoading={isLoading} />
			</Container>
		</Box>
	);
}
