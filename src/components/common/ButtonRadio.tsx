import {
	Box,
	Button,
	ButtonGroup,
	UseRadioGroupProps,
	useRadio,
	useRadioGroup,
} from '@chakra-ui/react';
import { useRef } from 'react';

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props: any) {
	const { state, getInputProps, getRadioProps } = useRadio(props);
	const ref = useRef<any>();
	const input = getInputProps();
	const checkbox = getRadioProps();

	return (
		<Button
			onClick={() => ref.current?.click()}
			as="label"
			borderColor='teal.400'
			variant={state.isChecked ? 'solid' : 'outline'}
		>
			<input {...input} />
			<Box {...checkbox} ref={ref as any} display="none" />
			{props.children}
		</Button>
	);
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
export default function MyButtonRadio({
	options,
	...rest
}: { options: string[] } & UseRadioGroupProps) {
	const { getRootProps, getRadioProps } = useRadioGroup({
		...rest,
	});

	const group = getRootProps();

	return (
		<ButtonGroup
			size="sm"
			isAttached
			rowGap='2'
			flexWrap="wrap"
			colorScheme="teal"
			variant="outline"
			{...group}
		>
			{options.map((value) => {
				const radio = getRadioProps({ value });
				return (
					<RadioCard key={value} {...radio}>
						{value}
					</RadioCard>
				);
			})}
		</ButtonGroup>
	);
}
