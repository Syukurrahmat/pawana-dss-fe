declare module "*.svg" {
    export default string;
}
declare module "*.gif" {
    export default string;
}

type ConfirmMessage = {
    title: string,
    message: string,
    onConfirm: () => Promise<void> | null,
    confirmButtonColor?: string,
    confirmText?: string,
} | null


type LocationData = {
    [key: string]: any;
    coordinate: number[]
};

type DataAndMutateProp<T> = {
    data: T;
    mutate: KeyedMutator<any>;
}