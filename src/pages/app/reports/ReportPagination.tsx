
import { HStack, IconButton, Input } from '@chakra-ui/react'; //prettier-ignore
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';

interface ReportPagination {
	pagination: ReportsPagination | undefined;
	dateState: StateOf<string>;
}

export default function ReportPagination({
	pagination,
	dateState,
}: ReportPagination) {
	const [date, setDate] = dateState;

	const next = pagination?.next;
	const previous = pagination?.previous;
	const current = pagination?.current;

	return (
		<HStack justify="space-between" w="full">
			<IconButton
				variant="outline"
				icon={<IconChevronLeft />}
				aria-label="previous"
				isDisabled={!previous}
				onClick={() => (previous ? setDate(previous) : null)}
			/>
			<Input
				variant="outline"
				onFocus={(e) => e.target.showPicker()}
				type="date"
				textAlign="center"
				max={moment().format('YYYY-MM-DD')}
				onChange={(e) => setDate(e.target.value)}
				value={current || date}
			/>
			<IconButton
				variant="outline"
				icon={<IconChevronRight />}
				aria-label="next"
				isDisabled={!next}
				onClick={() => (next ? setDate(next) : null)}
			/>
		</HStack>
	);
}
