export const UNIT_CH4 = 'PPM'
export const UNIT_CO2 = 'PPM'
export const UNIT_PM = 'µg/m³'

export const MAX_CH4 = 1200
export const MAX_CO2 = 1000

export const TRESHOLD_CH4 = [1000, 200].map(e => e / MAX_CH4)
export const TRESHOLD_CO2 = [350, 700 - 350, MAX_CO2 - 700].map(e => e / MAX_CO2)


export const GAUGE_CHART_COLORS = [ '#5BE12C', '#F5CD19', '#EA4228' ]