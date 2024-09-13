import { SelectFromDataTableCompanies } from '@/components/SelectFromDataTable/Sdd';
import SelectFromDataTable from '@/components/SelectFromDataTable/SelectFromDataTable';

import { Box, Button, Card, CardBody, CardHeader, Collapse, Divider, HStack, Icon, Step, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, Text, useDisclosure, useSteps } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronDown, IconChevronUp, IconCircleDot, IconSend2 } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { Range } from 'react-date-range';
import SelectDateRange from './selectDateRange';
import SelectNodeType from './selectNodeType';
import { NodeWithDateRange } from '.';
import { responsiveCardSize } from '@/utils/common.utils';
import useUser from '@/hooks/useUser';

type SelectNode = {
	selectedDataState: StateOf<NodeWithDateRange>;
};

export function FormSelectNode({ selectedDataState }: SelectNode) {
	const { isOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: true });
	const { roleIs } = useUser();

	const [selectedData, setSelectedData] = selectedDataState;
	const [type, setType] = useState<any>('public');
	const [node, setNode] = useState<any>();
	const [company, setCompany] = useState<any>();
	const [dateRange, setDateRange] = useState<Range>({
		startDate: selectedData.startDate,
		endDate: selectedData.endDate,
	});

	const { activeStep, setActiveStep } = useSteps({ index: 1 });
	const isPublicSelected = type == 'public';

	const isAdmin = roleIs(['admin', 'gov']);

	const nodeUrl = isAdmin
		? isPublicSelected
			? '/nodes?ownship=public&view=simple'
			: `/companies/${company?.companyId}/private-nodes?view=simple`
		: `/companies/${company?.companyId}/${isPublicSelected ? 'nodes' : 'private-nodes'}?view=simple`; //prettier-ignore

	const steps = (
		isAdmin
			? [
					<SelectNodeType
						onChange={(e) => {
							setType(e);
							setCompany(undefined);
							setNode(undefined);
							setActiveStep(1);
						}}
						value={type}
					/>,
					type === 'private' && (
						<SelectFromDataTableCompanies
							_value={company}
							_onChange={(e) => {
								setCompany(e);
								setNode(undefined);
								setActiveStep(isPublicSelected ? 1 : 2);
							}}
							border="0px solid"
							shadow="xs"
						/>
					),
					<SelectFromDataTable
						itemName="Node"
						apiUrl={nodeUrl}
						isDisabled={!company?.companyId && type !== 'public'}
						_value={node}
						_onChange={(e) => {
							setNode(e);
							setActiveStep(isPublicSelected ? 2 : 3);
						}}
						border="0px solid"
						shadow="xs"
						leftIcon={<IconCircleDot size="30px" />}
						displayRow={(row: any) => (
							<HStack>
								<IconCircleDot />
								<Text>{row.name}</Text>
							</HStack>
						)}
					/>,
					<SelectDateRange
						isDisabled={!node?.nodeId}
						dateRangeValue={dateRange}
						onChangeDateRange={(e) => {
							setActiveStep(isPublicSelected ? 3 : 4);
							setDateRange(e);
						}}
					/>,
					<Button
						isDisabled={!node?.nodeId}
						size="lg"
						fontSize="md"
						shadow="xs"
						colorScheme="blue"
						type="submit"
						rightIcon={<Icon as={IconSend2} boxSize="20px" ml="2" />}
						children="Dapatkan Data"
						onClick={() => {
							setActiveStep(isPublicSelected ? 4 : 5);
							setSelectedData({
								nodeId: node?.nodeId,
								startDate: dateRange.startDate!,
								endDate: dateRange.endDate!,
							});
							onClose();
						}}
					/>,
			  ]
			: [
					<SelectFromDataTableCompanies
						_value={company}
						_onChange={(e) => {
							setCompany(e);
							setNode(undefined);

							setActiveStep(1);
						}}
						border="0px solid"
						shadow="xs"
					/>,
					<SelectNodeType
						onChange={(e) => {
							setType(e);
							setNode(undefined);
							setActiveStep(2);
						}}
						value={type}
					/>,
					<SelectFromDataTable
						itemName="Node"
						apiUrl={nodeUrl}
						isDisabled={!company?.companyId}
						_value={node}
						_onChange={(e) => {
							setNode(e);
							setActiveStep(3);
						}}
						border="0px solid"
						shadow="xs"
						leftIcon={<IconCircleDot size="30px" />}
						displayRow={(row: any) => (
							<HStack>
								<IconCircleDot />
								<Text>{row.name}</Text>
							</HStack>
						)}
					/>,
					<SelectDateRange
						isDisabled={!node?.nodeId}
						dateRangeValue={dateRange}
						onChangeDateRange={(e) => {
							setActiveStep(4);
							setDateRange(e);
						}}
					/>,
					<Button
						isDisabled={!node?.nodeId}
						size="lg"
						fontSize="md"
						shadow="xs"
						colorScheme="blue"
						type="submit"
						rightIcon={<Icon as={IconSend2} boxSize="20px" ml="2" />}
						children="Dapatkan Data"
						onClick={() => {
							setActiveStep(5);
							setSelectedData({
								nodeId: node?.nodeId,
								startDate: dateRange.startDate!,
								endDate: dateRange.endDate!,
							});
							onClose();
						}}
					/>,
			  ]
	).filter((e) => e);

	return (
		<Card
			size={responsiveCardSize}
			w="full"
			bg="white"
			rounded="md"
			overflow="hidden"
			shadow="xs"
		>
			<CardHeader
				as={Button}
				w="full"
				variant="outline"
				border="0"
				justifyContent="space-between"
				size="lg"
				fontSize="md"
				rounded="0"
				onClick={onToggle}
				rightIcon={<Icon as={isOpen ? IconChevronUp : IconChevronDown} />}
			>
				Pilih Node yang hendak diunduh
			</CardHeader>

			<Collapse in={isOpen} animateOpacity>
				<Divider />
				<CardBody>
					<Stepper
						index={activeStep}
						orientation="vertical"
						gap="3"
						className="myStepper"
					>
						{steps.map((step, index) => (
							<Step key={index}>
								<StepIndicator mr="2">
									<StepStatus
										complete={<StepIcon />}
										incomplete={<StepNumber />}
										active={<StepNumber />}
									/>
								</StepIndicator>
								<Box className="myStepper-item">{step}</Box>
								<StepSeparator />
							</Step>
						))}
					</Stepper>
				</CardBody>
			</Collapse>
		</Card>
	);
}
 