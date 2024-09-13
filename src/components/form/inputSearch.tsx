import {
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
} from '@chakra-ui/react';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

interface IInputSearch extends InputProps {
	_onSubmit: any;
}

export default function InputSearch({ _onSubmit, ...rest }: IInputSearch) {
	const [searchValue, setSearchValue] = useState('');

	return (
		<InputGroup {...rest} rounded="md">
			<Input
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				size={rest.size || 'md'}
				onKeyDown={(e) => {
					if (e.key === 'Enter') _onSubmit(searchValue);
				}}
				{...rest}
			/>
			<InputRightElement py="2">
				<IconButton
					onClick={() => {
						setSearchValue((e) => e.trim());
						_onSubmit(searchValue);
					}}
					aria-label="cari"
					icon={<IconSearch size={'1.5em'} />}
					size={rest.size == 'sm' ? 'xs' : 'sm'}
				/>
			</InputRightElement>
		</InputGroup>
	);
}
