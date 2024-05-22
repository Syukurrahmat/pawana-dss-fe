import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDateToHHMM } from '../../pages/app/dashboards/ISPU/SingleNodeISPU';

export default function MyISPUChart({ data }: { data: any[]; }) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				data={data}
				margin={{
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
				}}
			>
				<XAxis
					dataKey="datetime"
					tickFormatter={(e) => formatDateToHHMM(new Date(e))} />
				<Tooltip labelFormatter={(e) => new Date(e).getHours()} />
				<Bar
					radius={[3, 3, 0, 0]}
					dataKey="value"
					fill="var(--chakra-colors-green-400)"
					label={{ position: 'insideTop', className: 'color-white' }} />
			</BarChart>
		</ResponsiveContainer>
	);
}


