declare module "*.svg" {
    export default string;
}
declare module "*.gif" {
    export default string;
}

declare module "*.png" {
    export default string;
}


type UserRole =  'admin' | 'regular' | 'manager' | 'gov';

type ConfirmMessage = {
    title: string,
    message: string,
    onConfirm: () => Promise<void> | null,
    confirmButtonColor?: string,
    confirmText?: string,
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