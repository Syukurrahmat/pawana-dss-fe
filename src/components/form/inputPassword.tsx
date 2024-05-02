import { Input, InputGroup, InputRightElement, IconButton, InputProps } from '@chakra-ui/react'; // prettier-ignore
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';


interface IInputPassword extends InputProps {}

export default function InputPassword (props: IInputPassword){
	const [showPassword, setShowPassword] = useState(false);

	return (
		<InputGroup>
			<Input
				pr="3.5rem"
				type={showPassword ? 'text' : 'password'}
				{...props}
			/>
			<InputRightElement
				width="3.5rem"
				onClick={() => setShowPassword((e) => !e)}
			>
				<IconButton
					size="sm"
					variant="ghost"
					aria-label={
						showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'
					}
					icon={
						showPassword ? (
							<IconEyeOff size="20" />
						) : (
							<IconEye size="20" />
						)
					}
				/>
			</InputRightElement>
		</InputGroup>
	);
};
