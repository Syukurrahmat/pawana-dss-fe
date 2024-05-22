import { useHashBasedTabsIndex } from '@/hooks/useHashBasedTabsIndex';
import { Tabs, TabList, Tab, VStack, TabPanels, TabPanel } from '@chakra-ui/react'; // prettier-ignore
import ISPUAnalitic from './ISPUAnalitic';
import GRKAnalitic from './GRKAnalitic';

export default function Analysis() {
	const hashTabs = ['ispu', 'gas-emissions'];
	const [tabIndex, handleTabsChange] = useHashBasedTabsIndex(hashTabs);

	return (
		<VStack align="start">
			<Tabs mb="2" size="md" isLazy w="full" index={tabIndex} onChange={handleTabsChange}>
				<TabList>
					<Tab fontWeight="600">ISPU</Tab>
					<Tab fontWeight="600">Emisi GRK</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<ISPUAnalitic />
					</TabPanel>
					<TabPanel>
						<GRKAnalitic />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</VStack>
	);
}
