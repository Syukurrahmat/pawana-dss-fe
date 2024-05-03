import * as valSchema from '@/utils/validator.utils';
import * as Yup from 'yup';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, VStack, FormControl, FormLabel, Input, FormErrorMessage, Textarea, useToast, Text, Tag, Avatar} from '@chakra-ui/react'; //prettier-ignore
import { useFormik } from 'formik';
import { compareObjects, trimAllValues } from '@/utils/index.utils';
import { useState } from 'react';
import { API_URL } from '@/config';
import { KeyedMutator } from 'swr';
import axios from 'axios';
import InputSearch from '@/components/form/inputSearch';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/DataTable';

const columnHelper = createColumnHelper<GroupData>();
const columns = [
	columnHelper.accessor('name', {
		header: 'Nama',
		cell: (info) => info.getValue(),
		meta: { sortable: true },
	}),

	columnHelper.accessor('address', {
		header: 'Alamat',
		cell: (info) => (
			<Text noOfLines={2} whiteSpace="wrap">
				{info.getValue()}
			</Text>
		),
	}),
];

interface IAddGroupModal {
	isOpen: boolean;
	onClose: () => void;
	data: { [key: string]: string };
}

export default function AddGroupModal({
	isOpen,
	onClose,
	data,
	...rest
}: IAddGroupModal) {
	const toast = useToast();

	return (
		<Modal
			size="lg"
			autoFocus={false}
			isOpen={isOpen}
			onClose={onClose}
			closeOnOverlayClick={false}
			{...rest}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Tambah Group</ModalHeader>
				<ModalBody>
					<InputSearch placeholder="Cari Grup" w="100%" />
					<DataTable
						mt='4'
						apiUrl={API_URL + '/groups'}
						columns={columns}
					/>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose}>
						Batal
					</Button>
					<Button type="submit" colorScheme="blue" ml={3}>
						Submit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
