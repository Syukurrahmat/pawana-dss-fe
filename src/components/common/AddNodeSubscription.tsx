import { Box, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Skeleton, Button, useDisclosure, BoxProps } from '@chakra-ui/react'; //prettier-ignore
import { HStack, Text } from '@chakra-ui/react';
import MyMap from '@/components/Maps';
import useSWR, { mutate } from 'swr';
import { apiFetcher } from '@/utils/fetcher';
import { GenerateNodesMarkerWithSubs } from '@/components/Maps/Marker';
import React, { useState } from 'react';
import InputSearch from '@/components/Form/inputSearch';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';

interface AddNodeUserSubs extends BoxProps {
	countSubscribedNode: number;
	userId: number;
}

interface AddNodeCompanySubs extends BoxProps {
	countSubscribedNode: number;
	companyData: DataWithCoordinate;
}

interface AddNodeSubs extends BoxProps {
	countSubscribedNode: number;
	apiURL: string;
	postDataApiURL: string;
	companyData?: DataWithCoordinate;
}

type SelectedNode = { nodeId: number; name: string };

export function AddNodeUserSubscription(props: AddNodeUserSubs) {
	const { userId, ...rest } = props;

	return (
		<AddNodeSubscription
			apiURL={`/nodes/available?forUserSubs=${userId}`}
			postDataApiURL={`${API_URL}/users/${userId}/nodes`}
			{...rest}
		/>
	);
}

export const AddNodeCompanySubscription = React.forwardRef(
	(props: AddNodeCompanySubs) => {
		const { companyData, ...rest } = props;

		return (
			<AddNodeSubscription
				companyData={companyData}
				apiURL={`/nodes/available?forCompanySubs=${companyData.companyId}`}
				postDataApiURL={`${API_URL}/companies/${companyData.companyId}/nodes`}
				{...rest}
			/>
		);
	}
);

function AddNodeSubscription({
	countSubscribedNode,
	apiURL,
	postDataApiURL,
	companyData,
	...rest
}: AddNodeSubs) {
	const { toast, apiResponseToast } = useApiResponseToast();

	const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const limitationToast = () =>
		toast({
			title: 'Opsss',
			description:
				'Node yang diikuti dibatasi maksimal 5 node, \nHapus node yang lain terlebih dahulu untuk menambahkan ',
			status: 'warning',
		});

	const buttonOnClickHandle = () => {
		if (countSubscribedNode >= 5) return limitationToast();
		console.log(postDataApiURL.replace(API_URL, ''));
		onOpen();
	};

	const onSelectChange = (s: SelectedNode) => {
		const limit = 5 - countSubscribedNode;
		if (selectedNodes.length >= limit) return limitationToast();

		setSelectedNodes((prev) =>
			prev.find((e) => e.nodeId == s.nodeId)
				? prev.filter((e) => e.nodeId !== s.nodeId)
				: [...prev, s]
		);
	};

	const onPreSubmitHandler = async () => {
		if (!selectedNodes.length) {
			return toast({
				title: 'Opss',
				description: 'Sepertinya Anda belum menambahkan Node',
				status: 'warning',
			});
		}

		setIsSubmiting(true);
		const nodeIds = selectedNodes.map((e) => e.nodeId);
		const response = await axios.post(postDataApiURL, { nodeIds });

		apiResponseToast(response.data, {
			onSuccess: () =>
				mutate((e) => e && e[0] == postDataApiURL.replace(API_URL, '')),
		});
		setIsSubmiting(false);
		onClose();
	};

	return (
		<>
			<Box onClick={buttonOnClickHandle} {...rest} />

			<Modal
				closeOnEsc={false}
				closeOnOverlayClick={false}
				size="5xl"
				isOpen={isOpen}
				onClose={onClose}
				onCloseComplete={() => setSelectedNodes([])}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Tambahkan node</ModalHeader>
					{!isSubmiting && <ModalCloseButton />}
					<ModalBody py="0">
						<HStack mb="3" alignItems="start">
							<HStack
								wrap="wrap"
								minH="35px"
								py="1"
								px="2"
								flexGrow="1"
								rounded="md"
								border="1px solid"
								borderColor="gray.200"
							>
								{selectedNodes.length ? (
									selectedNodes.map(({ nodeId, name }) => (
										<Tag key={nodeId} colorScheme="blue">
											<TagLabel children={name} />
											<TagCloseButton
												onClick={() =>
													setSelectedNodes((prev) =>
														prev.filter(
															(e) => e.nodeId !== nodeId
														)
													)
												}
											/>
										</Tag>
									))
								) : (
									<Text color="gray.500">Belum ada yang dipilih</Text>
								)}
							</HStack>
							<InputSearch
								minW="230px"
								_onSubmit={null}
								placeholder="Cari node"
							/>
						</HStack>

						<FindInMapElement
							selectedNodes={selectedNodes}
							onSelectChange={onSelectChange}
							apiURL={apiURL}
							companyData={companyData}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="gray"
							mr={3}
							isDisabled={isSubmiting}
							onClick={onClose}
							children="Batal"
						/>
						<Button
							isLoading={isSubmiting}
							colorScheme="blue"
							onClick={onPreSubmitHandler}
							children="Tambahkan"
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

interface FindInMapElement {
	selectedNodes: any;
	onSelectChange: any;
	companyData?: DataWithCoordinate;
	apiURL: string;
}

function FindInMapElement(props: FindInMapElement) {
	const { selectedNodes, companyData, onSelectChange, apiURL } = props;
	const { data } = useSWR(apiURL, apiFetcher);

	return (
		<>
			<MyMap
				companiesData={companyData ? [companyData] : []}
				marker={GenerateNodesMarkerWithSubs(selectedNodes, onSelectChange)}
				data={data ? data.result : []}
				as={data ? undefined : Skeleton}
				centerAuto={false}
			/>
		</>
	);
}
