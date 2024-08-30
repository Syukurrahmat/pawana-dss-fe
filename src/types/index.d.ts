
declare module "*.svg" {
    export default string;
}
declare module "*.gif" {
    export default string;
}

declare module "*.png" {
    export default string;
}

declare module "*.jpg" {
    export default string;
}

type ConfirmMessage = {
    title: string,
    message: any,
    onConfirm: () => Promise<void> | void |  null,
    confirmButtonColor?: string,
    confirmText?: string,
    withoutCancelButton?: boolean,
} | null


type DataWithCoordinate = {
    [key: string]: any;
    coordinate: number[]
};

type DataAndMutateProp<T> = {
    data: Partial<T>;
    mutate?: KeyedMutator<any>;
}

type StateOf<T> = [T, React.Dispatch<React.SetStateAction<T>>]