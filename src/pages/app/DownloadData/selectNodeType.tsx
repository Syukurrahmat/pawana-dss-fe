import { MyRadio } from '@/components/common/MyRadio';
import { HStack, RadioGroup, Text } from '@chakra-ui/react';

export default function SelectNodeType({
	onChange,
	value,
}: {
	onChange: (v: string) => any;
	value: string;
}) {
	return (
		<HStack shadow="xs" spacing="4" bg="gray.50" py="4" px="4" rounded="md">
			<Text fontWeight="600">Pilih Jenis Node :</Text>
			<RadioGroup onChange={onChange} value={value} as={HStack}>
				{[
					{ label: 'Node Publik', key: 'public' },
					{ label: 'Node Private', key: 'private' },
				].map((e) => (
					<MyRadio value={e.key} children={e.label} />
				))}
			</RadioGroup>
		</HStack>
	);
}
