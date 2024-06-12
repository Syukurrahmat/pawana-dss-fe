import DataTable from '@/components/DataTable';
import InputSearch from '@/components/Form/inputSearch';
import { TagCompanyType } from '@/components/Tags/index.tags';
import SectionTitle from '@/components/common/SectionTitle';
import { API_URL } from '@/constants/config';
import { companyTypeAttr } from '@/constants/enumVariable';
import { useApiResponseToast } from '@/hooks/useApiResponseToast';
import useConfirmDialog from '@/hooks/useConfirmDialog';
import { toFormatedDate } from '@/utils/dateFormating';
import { Button, Center, HStack, Icon, IconButton, Spacer, Tag, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconExternalLink, IconTrash, IconUsersGroup } from '@tabler/icons-react'; //prettier-ignore
import { createColumnHelper } from '@tanstack/react-table';
import axios from 'axios';
import { useMemo } from 'react';
import { Link as RLink } from 'react-router-dom';
import { KeyedMutator, mutate } from 'swr';

const columnHelper = createColumnHelper<DTSubscribedCompanies>();

interface UserSubsList {
	mutate: KeyedMutator<any>;
	data: NodeDataPage;
}

export default function CompanySubsctiptionsList({
	data,
	mutate: dataPageMutate,
}: UserSubsList) {
	let { nodeId, countCompanySubscribtion } = data;
	const confirmDialog = useConfirmDialog();
	const { apiResponseToast } = useApiResponseToast();
	const dataApiURL = `/nodes/${nodeId}/companies`;

	const handleDeleteSubs = (subscriptionid: number) => {
		confirmDialog({
			title: 'Hapus Usaha',
			message: 'Hapus pengguna dari daftar pelanggan node ' + data.name,
			confirmButtonColor: 'red',
			onConfirm: async () => {
				return axios
					.delete(
						API_URL + dataApiURL + '?subscriptionid=' + subscriptionid
					)
					.then(({ data: dt }) =>
						apiResponseToast(dt, {
							onSuccess: () => {
								mutate((e) => e && e[0] == dataApiURL);
								dataPageMutate();
							},
						})
					);
			},
		});
	};
	const handleDeleteAllSubs = () => {
		confirmDialog({
			title: 'Hapus Semua Usaha',
			message:
				'Hapus Semua usaha dari daftar pelanggan node ' + data.name,
			confirmButtonColor: 'red',
			onConfirm: async () => {
				return axios
					.delete(API_URL + dataApiURL + '?all=true')
					.then(({ data: dt }) =>
						apiResponseToast(dt, {
							onSuccess: () => {
								mutate((e) => e && e[0] == dataApiURL);
								dataPageMutate();
							},
						})
					);
			},
		});
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Nama',
				cell: (info) => {
					const { color, icon } = companyTypeAttr[info.row.original.type];

					return (
						<HStack spacing="3">
							<Center
								rounded="md"
								border="2px solid"
								borderColor={color + '.200'}
								color={color + '.500'}
								p="2"
								children={<Icon as={icon} boxSize="18px" />}
							/>
							<Text>{info.getValue()}</Text>
						</HStack>
					);
				},
				meta: { sortable: true },
			}),

			columnHelper.accessor('type', {
				header: 'Jenis ',
				cell: (info) => <TagCompanyType value={info.getValue()} />,
				meta: { sortable: true },
			}),

			columnHelper.accessor('joinedAt', {
				header: 'Berlangganan sejak',
				cell: (info) => toFormatedDate(info.getValue()),
				meta: { sortable: true },
			}),

			columnHelper.accessor('subscriptionId', {
				header: 'Aksi',
				cell: (info) => (
					<HStack>
						<IconButton
							size="sm"
							colorScheme="red"
							icon={<IconTrash size="16" />}
							aria-label="Hapus"
							onClick={() => handleDeleteSubs(info.getValue())}
						/>
						<RLink to={'/companies/' + info.row.original.companyId}>
							<Button
								colorScheme="blue"
								size="sm"
								leftIcon={<IconExternalLink size="16" />}
								children="Lihat Usaha"
							/>
						</RLink>
					</HStack>
				),
			}),
		],
		[]
	);

	return (
		<>
			<SectionTitle IconEl={IconUsersGroup}>
				Daftar Usaha yang mengikuti node ini
				<Tag colorScheme="blue" ml="2">
					{countCompanySubscribtion || 0}
				</Tag>
			</SectionTitle>

			<HStack mt="4">
				{!!countCompanySubscribtion && (
					<Button
						colorScheme="red"
						leftIcon={<IconTrash size="18" />}
						onClick={handleDeleteAllSubs}
						children="Hapus Semua Usaha"
					/>
				)}
				<Spacer />
				<InputSearch
					rounded="md"
					bg="white"
					placeholder="Cari Usaha"
					_onSubmit={null}
				/>
			</HStack>

			<DataTable
				mt="4"
				apiUrl={dataApiURL}
				columns={columns}
				emptyMsg={['Belum ada Usaha']}
			/>
		</>
	);
}
