import { responsiveCardSize } from '@/utils/common.utils';
import { toFormatedDatetime } from '@/utils/dateFormating';
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, CardProps, HStack, Icon, Image, ResponsiveValue, StackProps, Tag, Text, VStack } from '@chakra-ui/react'; //prettier-ignore
import { IconMapPin, IconMoodEmpty, IconMoodHeart, IconMoodSad, IconMoodSmile, IconMoodWrrr, IconStarFilled } from '@tabler/icons-react'; //prettier-ignore

interface IReportCard extends CardProps {
	data: ReportData;
	map?: any;
	showSeeInMap?: boolean;
}

export default function ReportCard({
	data,
	map,
	...rest
}: IReportCard) {
	return (
		<Card w="full" shadow="xs" size={responsiveCardSize} {...rest}>
			<CardHeader
				spacing="4"
				as={HStack}
				flexWrap="wrap"
				justify="space-between"
			>
				<HStack spacing="4" flexGrow="1">
					<Avatar name={data.creator.name} />
					<Box>
						<Text fontSize="lg" fontWeight="500">
							{data.creator.name}
						</Text>
						<Text fontSize="sm">
							{toFormatedDatetime(data.createdAt)}{' '}
						</Text>
					</Box>
				</HStack>
				<RatingIcons rating={data.rating} />
			</CardHeader>
			<CardBody py="0">
				<Text>{data.message}</Text>

				{!!data.images.length && <ReportImageGalery images={data.images} />}
			</CardBody>

			<CardFooter as={VStack} align="end">
				{!!map && (
					<Button
						leftIcon={<IconMapPin size="18" />}
						colorScheme="blue"
						size="sm"
						onClick={() => (map ? map.flyTo(data.coordinate, 17) : null)}
					>
						Lihat di map
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

export const RatingIconList = [
	{ icon: IconMoodWrrr, color: 'red.400' },
	{ icon: IconMoodSad, color: 'orange.400' },
	{ icon: IconMoodEmpty, color: 'yellow.400' },
	{ icon: IconMoodSmile, color: 'teal.500' },
	{ icon: IconMoodHeart, color: 'green.400' },
];

export function RatingIcons({
	rating,
	size = 'sm',
	...p
}: {
	rating: number;
	size?: ResponsiveValue<string>;
} & StackProps) {
	return (
		<HStack {...p}>
			<Icon
				as={RatingIconList[rating - 1].icon}
				color={RatingIconList[rating - 1].color}
				boxSize={size == 'sm' ? '38px' : '45px'}
			/>
			<Tag size={size}>
				{Array(5)
					.fill(null)
					.map((_, i) => (
						<Icon
							key={i}
							color={i + 1 <= rating ? 'orange.400' : 'gray.300'}
							as={IconStarFilled}
							// boxSize="12px"
						/>
					))}
			</Tag>
		</HStack>
	);
}

import { PhotoProvider, PhotoView } from 'react-photo-view';

function ReportImageGalery({ images }: { images: string[] }) {
	return (
		<PhotoProvider maskOpacity={0.5}>
			<HStack mt="5">
				{images.map((item, index) => (
					<PhotoView key={index} src={item}>
						<Image
							src={item}
							alt=""
							boxSize="50px"
							objectFit="cover"
							border="1px solid"
							borderColor="gray.300"
							rounded="md"
							cursor="pointer"
						/>
					</PhotoView>
				))}
			</HStack>
		</PhotoProvider>
	);
}
