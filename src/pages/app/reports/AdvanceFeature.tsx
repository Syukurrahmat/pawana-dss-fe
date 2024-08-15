
import { Box, Flex, HStack, Spinner, Switch, Text, useDisclosure } from '@chakra-ui/react'; //prettier-ignore
import FilterByDistance from './FilterByDistance';
import useUser from '@/hooks/useUser';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { useEffect, useState } from 'react';
import { FilterState } from '.';

interface AdvanceReportFeature {
	filterState: StateOf<FilterState>;
	showCompaniesState: StateOf<CompanyData[]>;
	filterDisclosure: ReturnType<typeof useDisclosure>;
	showCompaniesDisclosure: ReturnType<typeof useDisclosure>;
}

export default function AdvanceReportFeature({
	filterState,
	filterDisclosure,
	showCompaniesState,
	showCompaniesDisclosure,
}: AdvanceReportFeature) {
	const { user, roleIs } = useUser();

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

	const allCompaniesURL = roleIs(['admin', 'gov'])
		? `/companies?all=true&view=simple`
		: `/users/${user.userId}/companies?all=true&view=simple`;

	const { data: companiesData } = useSWR<Paginated<CompanyData>>(
		showCompaniesDisclosure.isOpen ? allCompaniesURL : null,
		fetcher
	);

	useEffect(() => {
		showCompaniesState[1](companiesData?.rows || []);
	}, [companiesData]);

	return (
		<Box w="full">
			<HStack w="full" justify="space-between">
				<Flex align="center">
					<Text fontWeight="500" alignSelf="start">
						Tampilkan Lokasi Usaha
					</Text>
					{showCompanyIsOpen && !companiesData && (
						<Spinner size="sm" ml="2" color="gray.500" />
					)}
				</Flex>

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
				apiUrl={allCompaniesURL}
				filterState={filterState}
			/>
		</Box>
	);
}
