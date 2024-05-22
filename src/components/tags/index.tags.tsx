import { companyTypeAttr, nodeStatusAttr, nodeTypeAttr, userRoleAttr } from '@/constants/enumVariable';
import { TagLeftIcon, TagLabel } from '@chakra-ui/react';
import { Tag } from '@chakra-ui/react';

export const TagCompanyType = ({ type }: { type: string }) => {
	const { color, name } = companyTypeAttr[type];

	return (
		<Tag textTransform="capitalize" colorScheme={color} children={name} />
	);
};

export const TagNodeType = ({ isPrivate = false }: { isPrivate: boolean }) => {
	const { color, icon, name } = nodeTypeAttr[isPrivate ? 'private' : 'public'];

	return (
		<Tag colorScheme={color} variant="outline">
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};

export const TagNodeStatus = ({ status }: { status: string }) => {
	const { color, icon, name } = nodeStatusAttr[status];

	return (
		<Tag colorScheme={color} variant="outline">
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};
export const TagUserRole = ({ role }: { role: string }) => {
	const { color, icon, name } = userRoleAttr[role];

	return (
		<Tag colorScheme={color}>
			<TagLeftIcon as={icon} />
			<TagLabel>{name}</TagLabel>
		</Tag>
	);
};
