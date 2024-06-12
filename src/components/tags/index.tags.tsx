import {
	companyTypeAttr,
	eventLogStatusAttr,
	eventLogsTypeAttr,
	nodeStatusAttr,
	nodeTypeAttr,
	userRoleAttr,
} from '@/constants/enumVariable';
import { TagLeftIcon, TagLabel, TagProps } from '@chakra-ui/react';
import { Tag } from '@chakra-ui/react';

interface MyTag extends TagProps {
	value: string;
}

export const TagCompanyType = ({ value: value, ...rest }: MyTag) => {
	const { color, name, icon } = companyTypeAttr[value];

	return (
		<Tag colorScheme={color} {...rest}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};

export const TagNodeType = ({ value = 'public', ...rest }: MyTag) => {
	const { color, icon, name } = nodeTypeAttr[value ? 'private' : 'public'];

	return (
		<Tag colorScheme={color} variant="outline" {...rest}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};

export const TagNodeStatus = ({ value: value, ...rest }: MyTag) => {
	const { color, icon, name } =
		nodeStatusAttr[value] || nodeStatusAttr.nonactive;

	return (
		<Tag colorScheme={color} variant="outline" {...rest}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};

export const TagUserRole = ({ value: value, ...rest }: MyTag) => {
	const { color, icon, name } = userRoleAttr[value] || userRoleAttr['regular'];

	return (
		<Tag colorScheme={color} {...rest}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};


export const TagEventLogType = ({ value: value, ...rest }: MyTag) => {
	const { color, icon, name } = eventLogsTypeAttr[value] || eventLogsTypeAttr['other'];

	return (
		<Tag colorScheme={color} {...rest}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};

export const TagEventLogStatus = ({ value: value, ...rest }: MyTag) => {
	const { color, icon, name } = eventLogStatusAttr[value] || eventLogStatusAttr['inProgress'];

	return (
		<Tag colorScheme={color} {...rest}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};
