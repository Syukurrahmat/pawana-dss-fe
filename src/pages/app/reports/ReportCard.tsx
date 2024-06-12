import { IconMapPin, IconMoodEmpty, IconMoodHeart, IconMoodSad, IconMoodSmile, IconMoodWrrr, IconStar, IconStarFilled } from '@tabler/icons-react'; //prettier-ignore
import { Button, Avatar, Box, HStack, Card, CardBody, Text, CardHeader, Spacer, Image, CardFooter, VStack, Icon, Tag, CardProps} from '@chakra-ui/react'; //prettier-ignore
import { toFormatedDate, toFormatedDatetime } from '@/utils/dateFormating';

interface IReportCard extends CardProps {
	data: ReportData;
	map?: any;
}

export default function ReportCard({ data, map, ...rest }: IReportCard) {
	return (
		<Card w="full" shadow="xs" {...rest}>
			<CardHeader spacing="4" as={HStack}>
				<Avatar name={data.creator.name} />
				<Box>
					<Text fontSize="lg" fontWeight="500">
						{data.creator.name}
					</Text>
					<Text fontSize="sm">{toFormatedDatetime(data.createdAt)} </Text>
				</Box>
				<Spacer />
				<RatingIcons rating={data.rating} />
			</CardHeader>
			<CardBody py="0">
				<Text>{data.message}</Text>

				{!!data.images.length && <ReportImageGalery images={data.images} />}
			</CardBody>
			<CardFooter as={VStack} align="end">
				<Button
					leftIcon={<IconMapPin size="18" />}
					colorScheme="blue"
					size="sm"
					onClick={() => (map ? map.flyTo(data.coordinate, 17) : null)}
				>
					Lihat di map
				</Button>
			</CardFooter>
		</Card>
	);
}

export const RatingIconList = [
	{ icon: IconMoodWrrr, color: 'red.400' },
	{ icon: IconMoodSad, color: 'orange.400' },
	{ icon: IconMoodEmpty, color: 'yellow.400' },
	{ icon: IconMoodSmile, color: 'green.400' },
	{ icon: IconMoodHeart, color: 'teal.500' },
];

export function RatingIcons({ rating }: { rating: number }) {
	return (
		<HStack>
			<Icon
				as={RatingIconList[rating - 1].icon}
				color={RatingIconList[rating - 1].color}
				boxSize="38px"
			/>
			<Tag size="sm">
				{Array(5)
					.fill(null)
					.map((_, i) => (
						<Icon
							key={i}
							color={i + 1 <= rating ? 'orange.400' : 'gray.300'}
							as={IconStarFilled}
							boxSize="12px"
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
