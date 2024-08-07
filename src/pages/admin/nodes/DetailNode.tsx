import LoadingComponent from '@/components/Loading/LoadingComponent';
import SectionTitle from '@/components/common/SectionTitle';
import TagWithIcon from '@/components/common/TagWithIcon';
import { CompanyCard } from '@/components/managerCard';
import { nodeStatusAttr, nodeTypeAttr } from '@/constants/enumVariable';
import useUser from '@/hooks/useUser';
import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';
import { pageDataFetcher } from '@/utils/fetcher';
import { Box, Button, Center, Container, Divider, Flex, HStack, Heading, Icon, Stat, StatLabel, StatNumber, Tag, Text } from '@chakra-ui/react'; //prettier-ignore
import { IconAddressBook, IconCalendar, IconChartBubble, IconCircleDot, IconEdit, IconInfoCircle, IconLock, IconTextCaption } from '@tabler/icons-react'; //prettier-ignore
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import CompanySubsctiptionsList from './DTCompanySubsctiptions';
import DTLastDataSent from './DTLastDataSent';
import UserSubsctiptionsList from './DTUserSubsctiptions';
import EditNodeProfileButton from './EditNodeProfile';
import NodePosisionInMap from './NodeCoordinate';

export default function DetailNode() {
	const { id } = useParams();
	const { roleIs } = useUser();

	const apiURLEntryPoint = `/nodes/${id}`;
	const { data, mutate } = useSWR<NodeDataPage>(
		apiURLEntryPoint,
		pageDataFetcher
	);

	if (!data) return <LoadingComponent />;

	const isPrivateNodePage = Boolean(data.owner);

	const statusAtt = nodeStatusAttr[data.isUptodate ? 'active' : 'nonactive'];
	const ownshipAtt = nodeTypeAttr[data.companyId ? 'private' : 'public'];

	return (
		<Box>
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
						{data.owner && <CompanyCard mt="3" data={data.owner} />}
					</Box>

					{roleIs(['admin', 'manager']) && (
						<EditNodeProfileButton
							data={data}
							mutate={mutate}
							colorScheme="blue"
							alignSelf="start"
							leftIcon={<IconEdit size="16" />}
							children={'Sunting Profil'}
						/>
					)}
				</HStack>

				<SectionTitle IconEl={IconTextCaption}>Deskripsi Node</SectionTitle>
				<Text>{data.description}</Text>

				{!isPrivateNodePage && (
					<>
						<SectionTitle IconEl={IconAddressBook}>Alamat</SectionTitle>
						<Text>{data.address}</Text>
					</>
				)}

				<SectionTitle IconEl={IconChartBubble}>Status</SectionTitle>
				<Flex mt="3" gap="4" flexWrap="wrap">
					<Stat
						flex="1 0 100px"
						bg={statusAtt.color + '.50'}
						p="4"
						rounded="md"
						border="2px solid"
						borderColor={statusAtt.color + '.400'}
					>
						<StatLabel>Status</StatLabel>
						<HStack spacing="2" my="1">
							<Icon as={statusAtt.icon} boxSize="28px" />
							<StatNumber
								textTransform="capitalize"
								children={statusAtt.name}
							/>
						</HStack>

						<HStack>
							<IconInfoCircle size="16" />
							<Text fontSize="sm">{statusAtt.note}</Text>
						</HStack>
						<Divider borderColor={statusAtt.color} mt="3" mb="2" />

						<Text fontSize="sm">
							Terakhir data diperbarui{' '}
							{toFormatedDatetime(data.lastDataSent)}
						</Text>
					</Stat>

					<Stat
						flex="1 0 100px"
						bg={ownshipAtt.color + '.50'}
						p="4"
						rounded="md"
						border="2px solid"
						borderColor={ownshipAtt.color + '.400'}
					>
						<StatLabel>Kepemilikan</StatLabel>
						<HStack spacing="2" my="1">
							<Icon as={ownshipAtt.icon} boxSize="28px" />
							<StatNumber
								textTransform="capitalize"
								children={ownshipAtt.name}
							/>
						</HStack>

						<HStack>
							<IconInfoCircle size="16" />
							<Text fontSize="sm">{ownshipAtt.note}</Text>
						</HStack>

						<Divider borderColor={ownshipAtt.color} mt="3" mb="2" />
						<HStack fontSize="sm" align="baseline">
							<Text>Dikelola oleh: </Text>
							<Tag size="sm" fontSize="xs">
								{data.owner?.name || 'Admin'}
							</Tag>
						</HStack>
					</Stat>
				</Flex>
				
				{!isPrivateNodePage && <NodePosisionInMap data={data} mutate={mutate} />}
				
				{!data.companyId && roleIs('admin') && (
					<>
						<CompanySubsctiptionsList data={data} mutate={mutate} />
						<UserSubsctiptionsList data={data} mutate={mutate} />
					</>
				)}

				<DTLastDataSent
					data={data.dataLogs}
					lastDataSent={data.lastDataSent}
					mutate={mutate}
				/>

				{roleIs('admin') && (
					<>
						<SectionTitle IconEl={IconLock}>Lainnya</SectionTitle>
						<Button colorScheme="red">Hapus Node</Button>
					</>
				)}
			</Container>
		</Box>
	);
}
