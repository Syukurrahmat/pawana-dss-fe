import { TagEventLogStatus, TagEventLogType } from '@/components/Tags/index.tags'; //prettier-ignore
import useConfirmDialog from '@/hooks/useConfirmDialog';
import useUser from '@/hooks/useUser';
import { delay, useMyToasts } from '@/utils/common.utils';
import { toFormatedDate } from '@/utils/dateFormating';
import { fetcher, myAxios } from '@/utils/fetcher';
import { Box, BoxProps, Button, HStack, Heading, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Portal, Skeleton, Spacer, Text, VStack, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import { IconCalendarEvent, IconChecks, IconDotsVertical, IconEdit, IconHourglass, IconMapPin, IconRocket, IconTrash } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface DetailEL extends BoxProps {
	eventId: number;
	readOnly?: boolean;
}

export default function DetailEventLogTriger({
	eventId,
	readOnly = false,
	...rest
}: DetailEL) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Box position="relative" onClick={onOpen} {...rest} />

			<Portal>
				<Modal size="xl" isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalCloseButton size="lg" />
						<ModalHeader>Detail kegiatan</ModalHeader>
						<DetailNote
							eventId={eventId}
							readOnly={readOnly}
							onClose={onClose}
						/>
					</ModalContent>
				</Modal>
			</Portal>
		</>
	);
}

interface DetailNote {
	eventId: number;
	readOnly?: boolean;
	onClose: any;
}

function DetailNote({ eventId, onClose, readOnly }: DetailNote) {
	const [isActionRunning, setIsActionRunning] = useState(false);
	const { user } = useUser();
	const toast = useMyToasts();
	const confirmDialog = useConfirmDialog();
	const companyId = user.view?.company?.companyId;

	const apiUrl = `/companies/${companyId}/events/${eventId}`;

	const { data: event, mutate: eventMutate } = useSWR<DetailEventLog>(
		apiUrl,
		fetcher
	);

	const mutateAllEvent = () =>
		mutate(
			(e) =>
				typeof e == 'string' &&
				e.startsWith(`/companies/${companyId}/events`)
		);

	const deleteEventHandler = async () => {
		onClose();
		await delay(300);

		confirmDialog({
			title: 'Hapus Kegiatan ini',
			message: 'Anda yakin hendak menghapus kegiatan ini dari perusahaan Anda',
			confirmButtonColor: 'red',
			onConfirm: () =>
				myAxios
					.delete(apiUrl)
					.then(() => {
						toast.success('Kegiatan berhasil dihapus');
						mutateAllEvent();
					})
					.catch(() => {
						toast.error('Kegiatan Gagal dihapus');
					}),
		});
	};

	const actionHandler = async (action: 'startnow' | 'endnow') => {
		setIsActionRunning(true);

		const putEntryApiUrl = apiUrl + (action == 'endnow' ? '/completed' : '/start-now'); //prettier-ignore

		myAxios
			.patch(putEntryApiUrl)
			.then(() => {
				toast.success('Kegiatan berhasil diupdate');
				mutateAllEvent();
				eventMutate((e) =>
					e ? { ...e, status: 'isCompleted' } : undefined
				);
			})
			.catch(() => {
				toast.error('Kegiatan gagal diupdate');
			})
			.finally(() => {
				setIsActionRunning(false);
			});
	};

	return (
		<>
			<ModalBody pt="1" pb="6">
				<VStack w="full" align="stretch">
					{event ? (
						<>
							<HStack>
								<TagEventLogStatus
									size="md"
									fontSize="md"
									py="1"
									value={event.status}
								/>
								<TagEventLogType
									size="md"
									fontSize="md"
									py="1"
									value={event.type}
								/>
							</HStack>
							<Heading size="lg" children={event.name} />
							<Text children={event.description} />
						</>
					) : (
						<>
							<HStack>
								<Skeleton rounded="md" h="6" w="80px" />
								<Skeleton rounded="md" h="6" w="80px" />
							</HStack>
							<Skeleton rounded="md" h="9" w="80%" />
							<Skeleton rounded="md" h="6" w="70%" />
							<Skeleton rounded="md" h="6" w="70%" />
						</>
					)}

					<Spacer />
					{event ? (
						<>
							<HStack>
								<Icon boxSize="6" as={IconCalendarEvent} />
								<Text>
									{toFormatedDate(event.startDate)}
									{event.startDate !== event.endDate &&
										' - ' +
											(toFormatedDate(event.endDate) || 'Selesai')}
								</Text>
							</HStack>
							<HStack>
								<Icon boxSize="6" as={IconMapPin} />
								<Text fontStyle={event.location ? 'inherit' : 'italic'}>
									{event.location || 'Tempat tidak ditentukan'}
								</Text>
							</HStack>

							{event.duration > 0 && (
								<HStack>
									<Icon boxSize="6" as={IconHourglass} />
									<Text>Durasi {event.duration} Hari</Text>
								</HStack>
							)}
						</>
					) : (
						Array(2)
							.fill(null)
							.map((_, i) => (
								<Skeleton key={i} rounded="md" h="6" w="60%" />
							))
					)}
				</VStack>
			</ModalBody>

			{!readOnly && (
				<ModalFooter as={HStack} justify="start" w="full">
					{!!event && (
						<>
							{event.status == 'inProgress' && (
								<Button
									leftIcon={<IconChecks size="20" />}
									colorScheme="green"
									children="Selesaikan Sekarang"
									isLoading={isActionRunning}
									onClick={() => actionHandler('endnow')}
								/>
							)}

							{event.status == 'upcoming' && (
								<Button
									leftIcon={<IconRocket size="20" />}
									colorScheme="orange"
									children="Mulai Sekarang"
									isLoading={isActionRunning}
									onClick={() => actionHandler('startnow')}
								/>
							)}
						</>
					)}

					<Spacer />

					<Menu>
						<MenuButton
							as={IconButton}
							aria-label="More"
							icon={<IconDotsVertical size="20" />}
						/>
						<MenuList>
							<MenuItem
								icon={<IconTrash size="18" />}
								onClick={deleteEventHandler}
								children="Hapus"
							/>
							<MenuItem icon={<IconEdit size="18" />}>Sunting</MenuItem>
						</MenuList>
					</Menu>
				</ModalFooter>
			)}
		</>
	);
}
