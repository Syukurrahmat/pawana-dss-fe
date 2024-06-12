import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Brush } from 'recharts'; // prettier-ignore
import { formatDateToHHMM } from '../../pages/app/dashboards/ISPU/SingleNodeISPU';

interface LineChartData {
	data: {
		[key: string]: any;
		datetime: any;
		value: any;
	}[];
	withBrush?: boolean;
}

export default function MyLineChart({ data, withBrush }: LineChartData) {
	data = data.map(({ datetime, ...e }) => ({
		...e,
		datetime: new Date(datetime).getTime(),
	}));

	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={data}
				margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id="colorId" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis
					type="number"
					dataKey="datetime"
					domain={['dataMin-10000', 'dataMax+10000']}
					tickFormatter={(e) => formatDateToHHMM(new Date(e))}
					tickCount={10}
				/>
				<YAxis width={30} />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />

				<Area
					type="monotone"
					dataKey="value"
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorId)"
				/>
				{withBrush && <Brush dataKey="datetime" />}
			</AreaChart>
		</ResponsiveContainer>
	);
}
