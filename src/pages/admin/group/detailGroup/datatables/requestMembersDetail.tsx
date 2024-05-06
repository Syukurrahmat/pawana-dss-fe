import { API_URL } from '@/constants/config';
import { toFormatedDate } from '@/utils/index.utils';
import { HStack, Button, Avatar, Text, Spacer, useToast} from '@chakra-ui/react'; //prettier-ignore
import { IconCheck, IconX} from '@tabler/icons-react'; //prettier-ignore
import InputSearch from '@/components/form/inputSearch';
import DataTable from '@/components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { Link as RLink, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import axios from 'axios';
import { useAlertDialog } from '@/layout';

const columnHelper = createColumnHelper<userOfGroupData>();

export default function RequestMembersDetail() {
	const alertDialog = useAlertDialog();
	
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [dataContext, setDataContext] = useState<userOfGroupData[]>([]);

	let { id } = useParams();
	const toast = useToast();

	const onClickHandle = (
		acc: boolean,
		userIds: number[],
		setIsSubmiting: any
	) => {
		setIsSubmiting(true);
		axios
			.put(API_URL + '/groups/' + id + '/permission', {
				status: acc ? 'approved' : 'rejected',
				userIds,
			})
			.then(({ data }) => {
				setIsSubmiting(false);
				data.success
					? toast({
							title: `Sukses`,
							description: data.message,
							status: 'success',
					  })
					: toast({
							title: `Gagal`,
							description: data.message,
							status: 'error',
					  });
			});
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => (
					<RLink to={'/users/' + info.row.original.userId}>
						<HStack spacing="4">
							<Avatar name={info.getValue()}  size="sm" />
							<Text>{info.getValue()}</Text>
						</HStack>
					</RLink>
				),
				meta: { sortable: true },
			}),

			columnHelper.accessor('GroupPermissions.requestJoinAt', {
				header: 'Meminta pada',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),
			columnHelper.display({
				header: 'Aksi',
				cell: ({ row: { original } }) => {
					const [isSubmiting, setIsSubmiting] = useState(false);

					return (
						<HStack>
							<Button
								colorScheme="green"
								size="xs"
								leftIcon={<IconCheck size="16" />}
								onClick={() =>
									onClickHandle(
										true,
										[original.userId],
										setIsSubmiting
									)
								}
								isLoading={isSubmiting}
							>
								Terima
							</Button>
							<Button
								colorScheme="red"
								size="xs"
								leftIcon={<IconX size="16" />}
								onClick={() =>
									onClickHandle(
										false,
										[original.userId],
										setIsSubmiting
									)
								}
								isLoading={isSubmiting}
							>
								Tolak
							</Button>
						</HStack>
					);
				},
			}),
		],
		[]
	);

	return (
		<>
			<HStack mt="4" justify="space-between">
				<Button
					colorScheme="green"
					
					leftIcon={<IconCheck size="16" />}
					isLoading={isSubmiting}
					onClick={() =>
						alertDialog({
							title: 'Terima Semua Permintan',
							message:
								'Apakah Anda yakin hendak menerika semua permintaan?',
							onConfirm: () => {
								onClickHandle(
									true,
									dataContext.map((e) => e.userId),
									setIsSubmiting
								);
							},
						})
					}
				>
					Terima Semua
				</Button>

				<Button
					colorScheme="red"
					
					leftIcon={<IconX size="16" />}
					isLoading={isSubmiting}
					onClick={() =>
						alertDialog({
							title: 'Tolak Semua Permintan',
							message:
								'Apakah Anda yakin Hendak menolak semua permintaan?',
							onConfirm: () => {
								onClickHandle(
									false,
									dataContext.map((e) => e.userId),
									setIsSubmiting
								);
							},
						})
					}
				>
					Tolak Semua
				</Button>
				<Spacer />
				<InputSearch
					rounded="md"
					size="md"
					bg="white"
					placeholder="Cari Pelanggan"
					_onSubmit={null}
				/>
			</HStack>
			<DataTable
				maxH="400px"
				mt="4"
				apiUrl={API_URL + '/groups/' + id + '/users?status=pending'}
				columns={columns}
				emptyMsg={['Belum ada Pelanggan', 'Tambahkan Pelanggan sekarang']}
				setDataContext={setDataContext}
			/>
		</>
	);
}
