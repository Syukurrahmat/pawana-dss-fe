import InputSearch from '@/components/Form/inputSearch';
import MyMap from '@/components/Maps';
import { useMyToasts } from '@/utils/common.utils';
import { fetcher, myAxios } from '@/utils/fetcher';
import { Box, BoxProps, Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Stack, Tag, TagCloseButton, TagLabel, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import qs from 'qs';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { generateNodesMarkerForNodeSubs } from '../Maps/marker/MarkerForNodeSubs';

interface NodeSubs extends BoxProps {
	subsInfo:
		| { type: 'user'; userId: number }
		| { type: 'company'; companyData: DataWithCoordinate };
}

type SelectedNode = { nodeId: number; name: string };

export default function NodeSubscription({ subsInfo, ...rest }: NodeSubs) {
	const toast = useMyToasts();
	const [selectedNodes, setSelectedNodes] = useState<SelectedNode[]>([]);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const baseUrl =
		subsInfo.type === 'user'
			? `/users/${subsInfo.userId}`
			: `/companies/${subsInfo.companyData.companyId}`;

	const patchDataApiURL = baseUrl + '/nodes';
	const dashboardURL = baseUrl + '/dashboard';

	const urlQuery =
		subsInfo.type === 'user'
			? { forUserSubs: subsInfo.userId }
			: { forCompanySubs: subsInfo.companyData.companyId };

	const apiURL = `/nodes/subscribeable?${qs.stringify(urlQuery)}`;
	const limitSubsURL = `${patchDataApiURL}/limit`;

	const { data: limit, mutate: mutateLimit } = useSWR<number>(
		limitSubsURL,
		fetcher
	);

	const limitationToast = () =>
		toast.opss(
			'Node yang diikuti dibatasi maksimal 5 node, \nHapus node yang lain terlebih dahulu untuk menambahkan '
		);

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
			return toast.opss('Sepertinya Anda belum menambahkan Node');
		}
		setIsSubmiting(true);

		const nodeIds = selectedNodes.map((e) => e.nodeId);
		myAxios
			.patch(patchDataApiURL, { nodeIds })
			.then(() => {
				toast.success(nodeIds.length + ' node publik berhasil ditambahkan');
				mutate(
					(e) => typeof e == 'string' && e.startsWith(patchDataApiURL)
				);
				mutate((e) => typeof e == 'string' && e.startsWith(dashboardURL));
				mutateLimit((e) => (e || 0) - nodeIds.length);
			})
			.catch(() => {
				toast.error('Node publik gagal ditambahkan');
			})
			.finally(() => {
				setIsSubmiting(false);
				onClose();
			});
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
					<ModalHeader>Tambah Ikuti Node Publik</ModalHeader>
					{!isSubmiting && <ModalCloseButton />}

					<ModalBody py="0">
						{limit !== undefined ? (
							<>
								{limit ? (
									<>
										<Stack
											mb="3"
											direction={{
												base: 'column-reverse',
												md: 'row',
											}}
											align="stretch"
										>
											<HStack
												minH="35px"
												py="1"
												px="2"
												flex="1 0 0"
												wrap="wrap"
												rounded="md"
												border="1px solid"
												borderColor="gray.200"
											>
												{selectedNodes.length ? (
													selectedNodes.map(({ nodeId, name }) => (
														<Tag
															key={nodeId}
															colorScheme="blue"
															w="fit-content"
														>
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
														Belum ada Node yang dipilih
													</Text>
												)}
											</HStack>
											<InputSearch
												width={{
													base: 'full',
													md: '250px',
												}}
												_onSubmit={null}
												placeholder="Cari node"
											/>
										</Stack>

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
	const { data } = useSWR<NodeData[]>(apiURL, fetcher);

	return (
		<>
			<MyMap
				focusInOneCompany
				companiesData={companyData ? [companyData] : []}
				marker={generateNodesMarkerForNodeSubs(
					selectedNodes,
					onSelectChange
				)}
				data={data || []}
				as={data ? undefined : Skeleton}
				centerAuto={false}
			/>
		</>
	);
}
