import RequiredIndicator from '@/components/Form/RequiredIndicator';
import MyMap from '@/components/Maps';
import { CENTER_OF_MAP } from '@/constants/config';
import { Box, FormControl, FormErrorMessage, FormHelperText, FormLabel, HStack, Input } from '@chakra-ui/react'; //prettier-ignore


interface FormMapPicker {
	errors?: string | string[];
	touched?: boolean;
	values: number[];
	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => any;
}
export default function FormMapPicker({
	errors,
	touched,
	values,
	setFieldValue,
}: FormMapPicker) {
	return (
		<FormControl isInvalid={Boolean(errors) && touched}>
			<FormLabel>
				Koordinat Node <RequiredIndicator />
			</FormLabel>
			<HStack w="full">
				<Box w="full">
					<FormHelperText>Masukkan Latitude</FormHelperText>
					<Input
						mt="2"
						type="number"
						value={values[0]}
						onChange={(e) =>
							setFieldValue('coordinate', [e.target.value, values[1]])
						}
					/>
				</Box>
				<Box w="full">
					<FormHelperText>Masukkan langitude</FormHelperText>
					<Input
						mt="2"
						type="number"
						value={values[1]}
						onChange={(e) =>
							setFieldValue('coordinate', [values[0], e.target.value])
						}
					/>
				</Box>
			</HStack>
			<FormHelperText>
				Geser peta dan paskan penanda ke titik yang dimaksud
			</FormHelperText>
			<MyMap
				mt="3"
				data={[]}
				outline={errors && touched ? '2px solid' : ''}
				outlineColor="#E53E3E"
				isEditing={{
					coordinate: values.filter((e) => e).length
						? values
						: CENTER_OF_MAP,
					onChange: (x) => setFieldValue('coordinate', [x.lat, x.lng]),
				}}
			/>

			<FormErrorMessage>{errors}</FormErrorMessage>
		</FormControl>
	);
}
