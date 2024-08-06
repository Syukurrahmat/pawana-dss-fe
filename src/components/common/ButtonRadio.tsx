import {
	Box,
	Button,
	HStack,
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
		<Box as="label">
			<input {...input} />
			<Box {...checkbox} ref={ref as any} display="none" />
			<Button
				onClick={() => ref.current?.click()}
				border="1px solid"
				borderColor="teal.500"
				size="sm"
				variant={state.isChecked ? 'solid' : 'outline'}
				colorScheme="teal"
				children={props.children}
			/>
		</Box>
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
		<HStack {...group}>
			{options.map((value) => {
				const radio = getRadioProps({ value });
				return (
					<RadioCard key={value} {...radio}>
						{value}
					</RadioCard>
				);
			})}
		</HStack>
	);
}
