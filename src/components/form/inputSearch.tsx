import {
	Input,
	InputGroup,
	InputLeftElement,
	InputProps,
	InputRightElement,
	Stack,
} from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons-react';

interface IInputSearch extends InputProps {
}

export default function InputSearch({ ...rest }: IInputSearch) {
	return (
		<InputGroup size={rest.size || 'md' } w={rest.w || "fit-content"}>
			<InputLeftElement pointerEvents="none" color='gray.500'>
				<IconSearch size={'1.5em'} />
			</InputLeftElement>
			<Input size={rest.size || 'md' } {...rest} />
		</InputGroup>
	);
}
