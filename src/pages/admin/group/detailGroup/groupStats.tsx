import { HStack, Tag, TagLeftIcon, TagLabel, BoxProps} from '@chakra-ui/react'; //prettier-ignore
import { IconCircleDot, IconUser, IconUserQuestion} from '@tabler/icons-react'; //prettier-ignore

interface IGroupStats extends BoxProps {
	data: detailOfGroupData;
}

export default function GroupStats({ data, ...rest }: IGroupStats) {
	return (
		<HStack {...rest}>
			<Tag size="md" variant="subtle" colorScheme="green">
				<TagLeftIcon boxSize="16px" as={IconUser} />
				<TagLabel>{data.membersCount | 0} Pelanggan</TagLabel>
			</Tag>
			{Boolean(data.memberRequestsCount) && (
				<Tag size="md" variant="subtle" colorScheme="orange">
					<TagLeftIcon boxSize="16px" as={IconUserQuestion} />
					<TagLabel>{data.memberRequestsCount} Permintaan</TagLabel>
				</Tag>
			)}
			<Tag size="md" variant="subtle" colorScheme="blue">
				<TagLeftIcon boxSize="16px" as={IconCircleDot} />
				<TagLabel>{data.nodeCount | 0} Node</TagLabel>
			</Tag>
		</HStack>
	);
}
