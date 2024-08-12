import { Box, HStack, Switch, Text, useDisclosure } from '@chakra-ui/react'; //prettier-ignore


export default function AdvanceFeature({
	apiUrl,
	distanceState,
	companiesState,
	filterDisclosure,
	showCompaniesDisclosure
}:{
	distanceState : StateOf<number>
	companiesState : StateOf<any>
	apiUrl : string,
	filterDisclosure : ReturnType<typeof useDisclosure>
	showCompaniesDisclosure : ReturnType<typeof useDisclosure>
}) {
	const {
		isOpen: filterIsOpen,
		onToggle: onToggleFilter,
		onClose: onCloseFilter,
	} = filterDisclosure;
	const {
		isOpen: showCompanyIsOpen,
		onToggle: onToggleShowCompany,
		onClose: onCloseShowCompany,
	} = showCompaniesDisclosure;

	return (
		<Box w="full">
			<HStack w="full" justify="space-between">
				<Text fontWeight="500" alignSelf="start">
					Tampilkan Lokasi Usaha
				</Text>

				<Switch
					onChange={(e) => {
						if (e.target.checked) {
							onCloseFilter();
						}
						onToggleShowCompany();
					}}
					isChecked={showCompanyIsOpen}
				/>
			</HStack>
			<HStack w="full" justify="space-between" mt="4">
				<Text fontWeight="500" alignSelf="start">
					Filter aduan di sekitar usaha Anda
				</Text>

				<Switch
					onChange={(e) => {
						if (e.target.checked) onCloseShowCompany();
						onToggleFilter();
					}}
					isChecked={filterIsOpen}
				/>
			</HStack>
			<FilterByDistance
				isOpen={filterIsOpen}
				apiUrl={apiUrl}
				distanceState={distanceState}
				companiesState={companiesState}
			/>
		</Box>
	);
}

import CompanyIcon from '@/components/common/CompanyIcon';
import SelectFromDataTable from '@/components/common/SelectFromDataTable';
import { Collapse, Select } from '@chakra-ui/react';

interface FilterDist {
	isOpen: boolean;
	apiUrl: string;
	distanceState: StateOf<number>;
	companiesState: StateOf<CompanyData| undefined>;
}

export const distanceList = [
	{ distance: 250, label: '250 m' },
	{ distance: 500, label: '500 m' },
	{ distance: 1000, label: '1 km' },
	{ distance: 2500, label: '2,5 km' },
];

function FilterByDistance({
	isOpen,
	distanceState,
	apiUrl,
	companiesState,
}: FilterDist) {
	const [companyId, setCompanyId] = companiesState;
	const [distance, setDistance] = distanceState;

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
							selectValue={companyId as any}
							selectOnChange={setCompanyId as any}
							hiddenSearchInput={true}
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
							value={distance}
							onChange={(e) => setDistance(parseInt(e.target.value))}
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
