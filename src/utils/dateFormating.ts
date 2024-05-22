import moment from "moment";


export const toFormatedDate = (str: string | undefined | null) => str ? moment(str).format('DD MMM YYYY') : "";
export const toFormatedDatetime = (str: string | undefined | null) => str ? moment(str).format('DD MMM YYYY HH:mm') : "";
