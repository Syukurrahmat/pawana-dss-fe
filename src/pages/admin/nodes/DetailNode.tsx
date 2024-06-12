import LoadingComponent from '@/components/Loading/LoadingComponent';
import SectionTitle from '@/components/common/SectionTitle';
import TagWithIcon from '@/components/common/TagWithIcon';
import UserCard from '@/components/managerCard';
import { API_URL } from '@/constants/config';
import { nodeStatusAttr, nodeTypeAttr } from '@/constants/enumVariable';
import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { pageDataFetcher } from '@/utils/fetcher';
import { Box, Button, Center, Container, Divider, Flex, HStack, Heading, Icon, Menu, MenuButton, MenuItem, MenuList, Spacer, Stat, StatLabel, StatNumber, Tag, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconCalendar, IconChartBubble, IconCircleDot, IconEdit, IconInfoCircle, IconKey, IconTextCaption } from '@tabler/icons-react'; //prettier-ignore
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import CompanySubsctiptionsList from './DTCompanySubsctiptions';
import DTLastDataSent from './DTLastDataSent';
import UserSubsctiptionsList from './DTUserSubsctiptions';
import EditNodeProfileButton from './EditNodeProfile';
import NodePosisionInMap from './NodeCoordinate';

export default function DetailNode() {
	let { id } = useParams();

	const [toggleStatusIsLoading, setToggleStatusIsLoading] = useState(false);
	const apiURLEntryPoint = `/nodes/${id}`;

	const { data, mutate } = useSWR<NodeDataPage>(
		apiURLEntryPoint,
		pageDataFetcher
	);

	const handleToggleStatus = async () => {
		setToggleStatusIsLoading(false);

		const resp = await axios.put(
			`${API_URL + apiURLEntryPoint}/toggle-status`,
			{ nodeId: id }
		);
		if (data) mutate({ ...data, status: resp.data.result });

		setToggleStatusIsLoading(true);
	};

	if (!data) return <LoadingComponent />;

	return (
		<Box style={{ paddingBottom: '1000px' }}>
			<HStack w="full" spacing="4" align="start">
				<HStack spacing="3">
					<Center
						boxSize="30px"
						boxShadow="xs"
						bg="gray.100"
						rounded="md"
						p="1"
					>
						<IconCircleDot />
					</Center>
					<Heading fontSize="xl" fontWeight="600">
						Detail Node
					</Heading>
				</HStack>
			</HStack>
			<Container mt="8" maxW="container.md">
				<HStack spacing="4" justify="space-between">
					<Box>
						<Heading fontSize="3xl" children={data.name} />
						<HStack mt="2">
							{!!data.instalationDate && (
								<TagWithIcon
									icon={IconCalendar}
									colorScheme="orange"
									children={`Node dipasang pada ${toFormatedDate(
										data.instalationDate
									)}`}
								/>
							)}
						</HStack>
						{data.owner && (
							<UserCard mt="3" data={data.owner} label="pemilik" />
						)}
					</Box>

					<EditNodeProfileButton
						data={data}
						mutate={mutate}
						colorScheme="blue"
						alignSelf="start"
						leftIcon={<IconEdit size="16" />}
						children={'Sunting Profil'}
					/>
				</HStack>

				<SectionTitle IconEl={IconTextCaption}>Deskripsi Node</SectionTitle>
				<Text>{data.description}</Text>

				<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
				<Text>{data.address}</Text>

				<SectionTitle IconEl={IconChartBubble}>Status</SectionTitle>
				<Flex mt="3" gap="4" flexWrap="wrap">
					{(() => {
						const { icon, name, color, note } =
							nodeStatusAttr[data.status] || nodeStatusAttr['active'];

						return (
							<Stat
								flex="1 0 100px"
								bg={color + '.50'}
								p="4"
								rounded="md"
								border="2px solid"
								borderColor={color + '.400'}
							>
								<StatLabel>Status</StatLabel>
								<HStack spacing="2" my="1">
									<Icon as={icon} boxSize="28px" />
									<StatNumber
										textTransform="capitalize"
										children={name}
									/>
									<Spacer />
									<Button
										isLoading={toggleStatusIsLoading}
										size="sm"
										colorScheme={
											data.status == 'nonactive' ? 'blue' : 'red'
										}
										children={
											data.status == 'nonactive'
												? 'Aktifkan'
												: 'Nonaktifkan'
										}
										onClick={handleToggleStatus}
									/>
								</HStack>

								<HStack>
									<IconInfoCircle size="16" />
									<Text fontSize="sm">{note}</Text>
								</HStack>
								<Divider borderColor={color} mt="3" mb="2" />

								<Text fontSize="sm">
									Terakhir data diperbarui{' '}
									{toFormatedDatetime(data.lastDataSent)}
								</Text>
							</Stat>
						);
					})()}
					{(() => {
						const { icon, name, color, note } =
							nodeTypeAttr[data.companyId ? 'private' : 'public'];

						return (
							<Stat
								flex="1 0 100px"
								bg={color + '.50'}
								p="4"
								rounded="md"
								border="2px solid"
								borderColor={color + '.400'}
							>
								<StatLabel>Kepemilikan</StatLabel>
								<HStack spacing="2" my="1">
									<Icon as={icon} boxSize="28px" />
									<StatNumber
										textTransform="capitalize"
										children={name}
									/>
									<Spacer />
									<Menu>
										<MenuButton
											as={Button}
											size="sm"
											colorScheme="blue"
											children="Ubah kepemilikan"
										/>
										<MenuList>
											<MenuItem>Jadikan Publik</MenuItem>
											<MenuItem>Ubah pemilik</MenuItem>
										</MenuList>
									</Menu>
								</HStack>

								<HStack>
									<IconInfoCircle size="16" />
									<Text fontSize="sm">{note}</Text>
								</HStack>

								<Divider borderColor={color} mt="3" mb="2" />
								<HStack fontSize="sm" align="baseline">
									<Text>Dikelola oleh: </Text>
									<Tag size="sm" fontSize="xs">
										{data.owner?.name || 'Admin'}
									</Tag>
								</HStack>
							</Stat>
						);
					})()}
				</Flex>

				<NodePosisionInMap data={data} mutate={mutate} />

				{!data.companyId && (
					<>
						<CompanySubsctiptionsList data={data} mutate={mutate} />
						<UserSubsctiptionsList data={data} mutate={mutate} />
					</>
				)}
				{!!data.lastDataSent && (
					<DTLastDataSent data={data} mutate={mutate} />
				)}

				<SectionTitle IconEl={IconKey}>API Key</SectionTitle>
				<Text fontSize="sm">
					Kode rahasia yang untuk kepentingan pengirimkan data dari sensor
					ke Node ini
				</Text>
			</Container>
		</Box>
	);
}

 