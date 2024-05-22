import { Button, ButtonProps, Link } from '@chakra-ui/react';
import { IconBrandGoogleMaps } from '@tabler/icons-react';

interface IGMapsButton extends ButtonProps {
	coordinate: number[];
}
export default function GMapsButton({ coordinate, ...rest }: IGMapsButton) {
	return (
		<Link
			href={`https://www.google.com/maps?q=${coordinate[0]},${coordinate[1]}`}
			target={'_blank'}
		>
			<Button
				size="sm"
				colorScheme="blue"
				variant="outline"
				iconSpacing="0.5"
				leftIcon={<IconBrandGoogleMaps size="16" />}
				children="Buka di Maps"
				{...rest}
			/>
		</Link>
	);
}
