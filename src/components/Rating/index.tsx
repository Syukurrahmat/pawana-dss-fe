import React, { useState } from 'react';
import { Radio, HStack, Box, RadioGroup, Center, Icon, Tag } from '@chakra-ui/react'; //prettier-ignore
import { IconMoodNeutral, IconStarFilled } from '@tabler/icons-react'; //prettier-ignore
import { RatingIconList } from '@/pages/app/reports/ReportCard';


interface IStarRating {
	rating: number;
	setRating: React.Dispatch<React.SetStateAction<number>>;
	size: number;
}

export default function StarRating({ rating, setRating, size }: IStarRating) {
	const [hover, setHover] = useState(0);

	const iconIndex = hover || rating;

	let ratingtext = [
		'Buruk sekali',
		'Buruk',
		'Biasa aja',
		'Bagus',
		'Bagus sekali',
	];

	return (
		<HStack mx="auto" w="fit-content">
			<Center border="1px solid" borderColor="gray.300" rounded="lg" p="2">
				<Icon
					as={
						iconIndex
							? RatingIconList[iconIndex - 1].icon
							: IconMoodNeutral
					}
					color={
						iconIndex ? RatingIconList[iconIndex - 1].color : 'gray.400'
					}
					boxSize="50px"
				/>
			</Center>
			<Box>
				<Tag>
					{iconIndex ? ratingtext[iconIndex - 1] : 'Pilih Berapa Bintang'}
				</Tag>
				<RadioGroup
					onChange={(e) => setRating(Number(e))}
					value={rating.toString()}
				>
					<HStack spacing="0">
						{[...Array(5)].map((_, index) => (
							<Center
								as="label"
								p="2"
								key={index}
								onMouseEnter={() => setHover(index + 1)}
								onMouseLeave={() => setHover(0)}
								cursor="pointer"
							>
								<Radio
									display="none"
									key={index}
									value={(index + 1).toString()}
								/>

								<Icon
									as={IconStarFilled}
									boxSize="25px"
									color={
										index + 1 <= (hover || rating)
											? 'yellow.400'
											: 'gray.300'
									}
								/>
							</Center>
						))}
					</HStack>
				</RadioGroup>
			</Box>
		</HStack>
	);
}
