import { Text } from "@chakra-ui/react";

export default function RequiredIndicator() {
	return (
		<Text
			as='span'
			role="presentation"
			aria-hidden="true"
			className="chakra-form__required-indicator"
			children="*"
			color="red.500"
		/>
	);
}
