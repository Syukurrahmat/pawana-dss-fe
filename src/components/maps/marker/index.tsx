import L from 'leaflet';
import { MarkerProps } from 'react-leaflet'; //prettier-ignore
import { ClusterProperties } from 'supercluster';
import CompanyMarker from './CompanyMarker';
import DetailNodesMarker from './DetailNodeMarker';
import ValueMarker from './MarkerWithValue';
import RatingMarker from './RatingMarker';

export interface MyMarker<T> extends MarkerProps {
	properties: T & ClusterProperties;
	position: L.LatLngExpression;
}

const MyMarker = {
	CompanyMarker,
	DetailNodesMarker,
	ValueMarker,
	RatingMarker,
};

export default MyMarker;
