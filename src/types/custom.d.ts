declare module "*.svg" {
    export default string;
}

type alertMessageType = {
    title: string,
    message: string,
    onConfirm: () => any,
    confirmButtonColor?: string,
    confirmText?: string,
} | null