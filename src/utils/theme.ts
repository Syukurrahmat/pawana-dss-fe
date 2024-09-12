import { extendTheme, ToastProviderProps } from "@chakra-ui/react";

export const myTheme = extendTheme({
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    colors: {
        dimmed: 'var(--chakra-colors-gray-600)'
    },
})

export const toastOptions: ToastProviderProps = {
    defaultOptions: {
        isClosable: true,
        variant: 'left-accent',
        position: 'top-right',
        containerStyle: {
            margin: '30px 30px 0 0',
        },
    },
}