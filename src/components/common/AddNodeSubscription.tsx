import InputSearch from '@/components/Form/inputSearch';
import MyMap from '@/components/Maps';
import { API_URL } from '@/constants/config';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import { fetcher, myAxios } from '@/utils/fetcher';
import { Box, BoxProps, Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Tag, TagCloseButton, TagLabel, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { generateNodesMarkerForNodeSubs } from '../Maps/marker/MarkerForNodeSubs';
import qs from 'qs';

interface NodeSubs extends BoxProps {
	subsInfo:
		| {
				type: 'user';
				userId: number;
		  }
		| {
				type: 'company';
				companyData: DataWithCoordinate;
		  };
}

type SelectedNode = { nodeId: number; name: string };

export default function NodeSubscription({ subsInfo, ...rest }: NodeSubs) {
	const { toast, apiResponseToast } = useApiResponseToast();
	const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	// ==========================

	const baseURL =
		subsInfo.type === 'user'
			? `/users/${subsInfo.userId}`
			: `/companies/${subsInfo.companyData.companyId}`;

	const urlQuery =
		subsInfo.type === 'user'
			? { forUserSubs: subsInfo.userId }
			: { forCompanySubs: subsInfo.companyData.companyId };

	const apiURL = `/nodes/available?${qs.stringify(urlQuery)}`;
	const postDataApiURL = `${baseURL}/nodes`;
	const remainingLimitURL = `${baseURL}/limit`;

	const { data: limit, mutate: mutateLimit } = useSWR<number>(
		remainingLimitURL,
		fetcher
	);

	const limitationToast = () =>
		toast({
			title: 'Opsss',
			description:
				'Node yang diikuti dibatasi maksimal 5 node, \nHapus node yang lain terlebih dahulu untuk menambahkan ',
			status: 'warning',
		});

	const nodeSelectedHandler = (s: SelectedNode) => {
		if (limit === undefined) return;
		if (selectedNodes.length >= limit) return limitationToast();

		setSelectedNodes((prev) =>
			prev.find((e) => e.nodeId == s.nodeId)
				? prev.filter((e) => e.nodeId !== s.nodeId)
				: [...prev, s]
		);
	};

	const submitHandler = async () => {
		if (!selectedNodes.length) {
			return toast({
				title: 'Opss',
				description: 'Sepertinya Anda belum menambahkan Node',
				status: 'warning',
			});
		}

		setIsSubmiting(true);
		const nodeIds = selectedNodes.map((e) => e.nodeId);
		const response = await myAxios.post(postDataApiURL, { nodeIds });
		mutateLimit((e) => (e || 0) + selectedNodes.length);
		apiResponseToast(response.data, {
			onSuccess() {
				mutate(
					(e: any) => e && e[0] == postDataApiURL.replace(API_URL, '')
				);
			},
		});
		setIsSubmiting(false);
		onClose();
	};

	return (
		<>
			<Box
				onClick={() => {
					onOpen();
					mutateLimit();
				}}
				children={rest.children}
			/>

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
						{limit !== undefined ? (
							<>
								{limit ? (
									<>
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
																			(e) =>
																				e.nodeId !== nodeId
																		)
																	)
																}
															/>
														</Tag>
													))
												) : (
													<Text color="gray.500">
														Belum ada yang dipilih
													</Text>
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
											onSelectChange={nodeSelectedHandler}
											apiURL={apiURL}
											companyData={
												subsInfo.type == 'company'
													? subsInfo.companyData
													: undefined
											}
										/>
									</>
								) : (
									<VStack>
										<Text fontWeight="600" fontSize="lg">
											Node yang diikuti dibatasi maksimal 5 node,
										</Text>
										<Text>
											Hapus node yang lain terlebih dahulu untuk
											menambahkan
										</Text>
									</VStack>
								)}
							</>
						) : (
							<Skeleton h="300px" rounded="md"></Skeleton>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="gray"
							mr={3}
							isDisabled={isSubmiting}
							onClick={onClose}
							children="Batal"
						/>
						{!!limit && (
							<Button
								isLoading={isSubmiting}
								colorScheme="blue"
								onClick={submitHandler}
								children="Tambahkan"
							/>
						)}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

interface FindInMapElement {
	selectedNodes: any;
	onSelectChange: (x: SelectedNode) => any;
	companyData?: DataWithCoordinate;
	apiURL: string;
}

function FindInMapElement(props: FindInMapElement) {
	const { selectedNodes, companyData, onSelectChange, apiURL } = props;
	const { data } = useSWR<any>(apiURL, fetcher);

	return (
		<>
			<MyMap
				companiesData={companyData ? [companyData] : []}
				marker={generateNodesMarkerForNodeSubs(
					selectedNodes,
					onSelectChange
				)}
				data={data ? data.result : []}
				as={data ? undefined : Skeleton}
				centerAuto={false}
			/>
		</>
	);
}
