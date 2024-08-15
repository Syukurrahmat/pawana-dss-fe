import { SelectFromDataTableCompanies } from '@/components/SelectFromDataTable/Sdd';
import SelectFromDataTable from '@/components/SelectFromDataTable/SelectFromDataTable';

import { Box, Button, Collapse, Divider, HStack, Icon, Step, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, Text, useDisclosure, useSteps } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronDown, IconChevronUp, IconCircleDot, IconSend2 } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import { Range } from 'react-date-range';
import SelectDateRange from './selectDateRange';
import SelectNodeType from './selectNodeType';
import { NodeWithDateRange } from '.';

type SelectNode = {
	selectedDataState: StateOf<NodeWithDateRange>;
};

export function FormSelectNodeForAdmin({ selectedDataState }: SelectNode) {
	const { isOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: true });

	const [selectedData, setSelectedData] = selectedDataState;
	const [type, setType] = useState<any>('public');
	const [node, setNode] = useState<any>();
	const [company, setCompany] = useState<any>();
	const [dateRange, setDateRange] = useState<Range>({
		startDate: selectedData.startDate,
		endDate: selectedData.endDate,
	});

	const isPublic = type == 'public';

	const nodeUrl = isPublic
		? '/nodes?ownship=public&view=simple'
		: `/companies/${company?.companyId}/private-nodes?view=simple`;

	const { activeStep, setActiveStep } = useSteps({ index: 1 });

	const steps = [
		<SelectNodeType
			onChange={(e) => {
				setType(e);
				setCompany(undefined);
				setNode(undefined);
				setActiveStep(1);
			}}
			value={type}
		/>,
		type === 'private' ? (
			<SelectFromDataTableCompanies
				_value={company}
				_onChange={(e) => {
					setCompany(e);
					setNode(undefined);
					setActiveStep(isPublic ? 1 : 2);
				}}
				border="0px solid"
				shadow="xs"
			/>
		) : null,
		<SelectFromDataTable
			itemName="Node"
			apiUrl={nodeUrl}
			isDisabled={!company?.companyId && type !== 'public'}
			_value={node}
			_onChange={(e) => {
				setNode(e);
				setActiveStep(isPublic ? 2 : 3);
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
				setActiveStep(isPublic ? 3 : 4);
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
				setActiveStep(isPublic ? 4 : 5);
				setSelectedData({
					nodeId: node?.nodeId,
					startDate: dateRange.startDate!,
					endDate: dateRange.endDate!,
				});
				onClose();
			}}
		/>,
	].filter((e) => e);

	return (
		<Box w="full" bg="white" rounded="md" overflow="hidden" shadow="xs">
			<Button
				w="full"
				variant="outline"
				border="0"
				justifyContent="space-between"
				size="lg"
				rounded="0"
				fontSize="md"
				p="4"
				onClick={onToggle}
				rightIcon={<Icon as={isOpen ? IconChevronUp : IconChevronDown} />}
			>
				Pilih Node yang hendak diunduh
			</Button>
			<Collapse in={isOpen} animateOpacity>
				<Divider />
				<Stepper
					p="4"
					index={activeStep}
					orientation="vertical"
					height={type === 'private' ? '352px' : '282px'}
					gap="0"
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
			</Collapse>
		</Box>
	);
}

export function FormSelectNodeForManager({ selectedDataState }: SelectNode) {
	const { isOpen, onClose, onToggle } = useDisclosure({ defaultIsOpen: true });

	const [selectedData, setSelectedData] = selectedDataState;
	const [type, setType] = useState<any>('public');
	const [node, setNode] = useState<any>();
	const [company, setCompany] = useState<any>();
	const [dateRange, setDateRange] = useState<Range>({
		startDate: selectedData.startDate,
		endDate: selectedData.endDate,
	});

	const nodeUrl = `/companies/${company?.companyId}/${
		type == 'public' ? 'nodes' : 'private-nodes'
	}?view=simple`;

	const { activeStep, setActiveStep } = useSteps({ index: 0 });

	const steps = [
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
	].filter((e) => e);

	return (
		<Box w="full" bg="white" rounded="md" overflow="hidden" shadow="xs">
			<Button
				w="full"
				variant="outline"
				border="0"
				justifyContent="space-between"
				size="lg"
				fontSize="md"
				rounded="0"
				p="4"
				onClick={onToggle}
				rightIcon={<Icon as={isOpen ? IconChevronUp : IconChevronDown} />}
			>
				Pilih Node yang hendak diunduh
			</Button>
			<Collapse in={isOpen} animateOpacity>
				<Divider />
				<Stepper
					p="4"
					index={activeStep}
					orientation="vertical"
					height="352px"
					gap="0"
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
			</Collapse>
		</Box>
	);
}
