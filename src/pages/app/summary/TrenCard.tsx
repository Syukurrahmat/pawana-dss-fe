import MyISPUChart from '@/components/Chart/ISPUChart';
import MyLineChart from '@/components/Chart/MyLineChart';
import MyButtonRadio from '@/components/common/ButtonRadio';
import { Button, Card, CardBody, CardHeader, Center, Divider, HStack, Heading, Spacer, Switch, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'; //prettier-ignore
import { useState } from 'react';
import { AirParamList } from '.';

interface TrenCard {
	title: string;
	tren: SummaryDataTren[];
	events: DTEventLog[];
	paramList: AirParamList[];
}

export function TrenCard({ title, tren, events, paramList }: TrenCard) {
	const [ss, setss] = useState(['indoor', 'outdoor']);
	const [showEvent, setShowEvent] = useState(false);

	return (
		<Card size="sm" shadow="xs">
			<CardHeader as={HStack}>
				<Heading
					size="md"
					fontSize="md"
					fontWeight="600"
					children={title}
				/>
				<Spacer />
				{!!tren.length && (
					<HStack as="label" cursor="pointer">
						<Text>Tampilkan Log Kegiatan</Text>
						<Switch
							isChecked={showEvent}
							onChange={() => setShowEvent((e) => !e)}
						/>
					</HStack>
				)}
			</CardHeader>
			{tren.length ? (
				<>
					<CardBody pt="0">
						<Tabs isLazy variant="unstyled" colorScheme="teal" size="sm">
							<TabList gap="2">
								{paramList.map((e, i) => (
									<Tab
										rounded="md"
										as={Button}
										size="sm"
										colorScheme="teal"
										border="1px solid"
										borderColor="teal.500"
										_selected={{
											bg: 'teal.500',
											color: 'white',
											_hover: {
												bg: 'teal.600',
											},
										}}
										variant="outline"
										children={e.name}
										key={i}
									/>
								))}
								<Spacer />
								<MyButtonRadio
									options={['In-site', 'Out-site', 'Keduanya']}
									value={ss.length == 2 ? 'Keduanya' : ss[0]}
									onChange={(e) => {
										setss(([pre]) => {
											if (e == 'Keduanya')
												return [
													pre,
													pre == 'In-site' ? 'Out-site' : 'In-site',
												];
											return [e.toLowerCase()];
										});
									}}
								/>
							</TabList>
							<Divider mt="4" borderColor="gray.400" />
							<TabPanels>
								{paramList.map((param, i) => (
									<TabPanel key={i} h="440px">
										{param.type == 'bar' ? (
											<MyISPUChart
												data={tren || []}
												withBrush={true}
												events={showEvent ? events : undefined}
												tickFormat="DD MMM YYYY"
												offsetDomain="day"
												dataKeyTypeAndFunc={ss.map((t) =>
													param.dataKeyTypeAndFunc(t as any)
												)}
											/>
										) : (
											<MyLineChart
												data={tren || []}
												withBrush={true}
												events={showEvent ? events : undefined}
												tickFormat="DD MMM YYYY"
												dataKeyTypeAndFunc={ss.map((t) =>
													param.dataKeyTypeAndFunc(t as any)
												)}
											/>
										)}
									</TabPanel>
								))}
							</TabPanels>
						</Tabs>
					</CardBody>
				</>
			) : (
				<Center w="full" pt="5" pb="8">
					<Text fontWeight="600" color="gray.500" fontSize="xl">
						Tidak Ada Data
					</Text>
				</Center>
			)}
		</Card>
	);
}
