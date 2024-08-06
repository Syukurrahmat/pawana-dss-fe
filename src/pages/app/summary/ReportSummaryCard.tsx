import MyMap from '@/components/Maps';
import { MarkerRating } from '@/components/Maps/Marker';
import { Alert, Card, CardBody, Center, Flex, Grid, HStack, Icon, Select, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconStar } from '@tabler/icons-react';
import { useState } from 'react';
import { RatingIconList } from '../reports/ReportCard';

interface ReportSummaryCard {
	data: SummaryReport;
	company: CompanyDataSummary;
}

export function ReportSummaryCard({ data, company }: ReportSummaryCard) {
	const [filter, setFilter] = useState(0);
	const { average, countPerStar, count, reports } = data;

	const ratingIcon = RatingIconList[Math.round(average) - 1];

	return (
		<Card size="sm" shadow="xs">
			<CardBody>
				{count ? (
					<Flex gap="4">
						<VStack flex="1 1 0" align="stretch">
							<Alert
								colorScheme={ratingIcon.color.slice(0, -4)}
								fontSize="md"
								p="3"
								variant="top-accent"
								as={VStack}
							>
								<HStack
									fontWeight="600"
									fontSize="md"
									alignSelf="start"
								>
									<Icon as={IconStar} boxSize="16px" />
									<Text>Rating Aduan Rata Rata</Text>
								</HStack>
								<HStack pt="2" alignSelf="center">
									<Icon
										as={ratingIcon.icon}
										color={ratingIcon.color}
										boxSize="50px"
									/>
									<HStack align="baseline" spacing="1">
										<Text fontWeight="700" fontSize="3xl">
											{average.toFixed(2)}
										</Text>
										<Text>/5.00</Text>
									</HStack>
								</HStack>
								<Text>Total Aduan : {count} Aduan</Text>
							</Alert>

							<Text fontWeight="600">
								Jumlah aduan berdasarkan bintang
							</Text>
							<Grid
								w="full"
								gap="2"
								templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
							>
								{countPerStar
									.map((e, i) => ({
										ratingIcon: RatingIconList[4 - i],
										rating: 5 - i,
										count: e,
									}))
									.map(({ ratingIcon, count, rating }) => (
										<VStack
											p="2"
											spacing="1"
											rounded="md"
											key={rating}
											bg={ratingIcon.color.slice(0, -4) + '.100'}
											cursor="pointer"
											_active={{
												bg: ratingIcon.color.slice(0, -4) + '.200',
											}}
											onClick={() => setFilter(rating)}
										>
											<HStack>
												<Text
													fontSize="xl"
													fontWeight="600"
													w="1ex"
													children={count}
												/>
												<Icon
													as={ratingIcon.icon}
													boxSize="30px"
													color={ratingIcon.color}
												/>
											</HStack>
											<Text>Bintang {rating}</Text>
										</VStack>
									))}
							</Grid>
							<HStack justify="space-between">
								<Text fontWeight="600">Filter aduan di peta</Text>
								<Select
									value={filter.toString()}
									onChange={(e) => setFilter(parseInt(e.target.value))}
									w="140px"
									cursor="pointer"
								>
									{Array.from({ length: 6 }, (_, i) => (
										<option
											key={i}
											value={i}
											children={i ? 'Rating ' + i : 'Semua Rating'}
										/>
									))}
								</Select>
							</HStack>
						</VStack>
						<MyMap
							flex="2 1 0"
							marker={MarkerRating}
							scrollWheelZoom={false}
							companiesData={[company]}
							data={reports.filter((e) =>
								filter ? e.rating == filter : true
							)}
						/>
					</Flex>
				) : (
					<Center w="full" py="5">
						<Text fontWeight="600" color="gray.500" fontSize="xl">
							Tidak Ada Aduan
						</Text>
					</Center>
				)}
			</CardBody>
		</Card>
	);
}
