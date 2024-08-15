
import { Button, HStack, IconButton, Input } from '@chakra-ui/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import moment from 'moment';

export interface SummaryPagination {
	state: StateOf<string>;
	type: 'month' | 'week';
	format: string;
}
export function SummaryPagination({ state, type, format }: SummaryPagination) {
	const [date, setDate] = state;

	const navHandler = (i: number) =>
		setDate(moment(date).add(i, type).format(format));

 
	return (
		<HStack spacing="1" justify="space-between">
			<IconButton
				bg="white"
				variant="outline"
				icon={<IconChevronLeft />}
				aria-label="previous"
				onClick={() => navHandler(-1)}
			/>
			<Input
				fontWeight="600"
				variant="outline"
				onFocus={(e) => e.target.showPicker()}
				type={type}
				bg="white"
				w="fit-content"
				textAlign="center"
				max={moment().format(format)}
				onChange={(e) => setDate(e.target.value)}
				value={date}
			/>
			<IconButton
				variant="outline"
				icon={<IconChevronRight />}
				aria-label="next"
				bg="white"
				isDisabled={moment(date).isSameOrAfter(moment().startOf(type))}
				onClick={() => navHandler(1)}
			/>
			<Button
				variant="outline"
				bg="white"
				onClick={() => setDate(moment().format(format))}
				children={type == 'month' ? 'Bulan Ini' : 'Minggu Ini'}
			/>
		</HStack>
	);
}
