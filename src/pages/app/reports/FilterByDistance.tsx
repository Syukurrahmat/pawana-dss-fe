import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/SelectFromDataTable/SelectFromDataTable';

import { Box, Collapse, HStack, Select, Text } from '@chakra-ui/react'; //prettier-ignore
import { FilterState } from '.';

export const distanceList = [
	{ distance: 250, label: '250 m' },
	{ distance: 500, label: '500 m' },
	{ distance: 1000, label: '1 km' },
	{ distance: 2500, label: '2,5 km' },
];

interface FilterDist {
	isOpen: boolean;
	apiUrl: string;
	filterState: StateOf<FilterState>;
}

export default function FilterByDistance({
	isOpen,
	filterState,
	apiUrl,
}: FilterDist) {
	const [filter, setFilter] = filterState;

	return (
		<Box w="full">
			<Collapse in={isOpen} animateOpacity>
				<HStack spacing="3" mt="4">
					<Box as="label" flexGrow="1">
						<Text mb="1">Usaha</Text>

						<SelectFromDataTable
							w="200px"
							fontWeight="400"
							itemName="Usaha"
							hiddenTitleButton={true}
							apiUrl={apiUrl}
							_value={filter.company}
							_onChange={(e) => setFilter((f) => ({ ...f, company: e }))}
							borderColor="gray.200"
							color="gray.700"
							displayRow={(e: any) => (
								<HStack>
									<CompanyIcon bg="white" type={e.type} />
									<Text children={e?.name || 'Node yang Anda ikuti'} />
								</HStack>
							)}
						/>
					</Box>
					<Box as="label" flexGrow="1">
						<Text mb="1">Jarak</Text>
						<Select
							value={filter.distance}
							onChange={(e) => {
								setFilter((f) => ({
									...f,
									distance: parseInt(e.target.value),
								}));
							}}
							children={distanceList.map((e) => (
								<option
									value={e.distance}
									key={e.distance}
									children={e.label}
								/>
							))}
						/>
					</Box>
				</HStack>
			</Collapse>
		</Box>
	);
}
