import { useToast } from "@chakra-ui/react";

type apiResponseToastHandle = {
    onSuccess?: () => any | null;
    onFailure?: () => any | null;
}

// handleApiResponseToast

export function useApiResponseToast() {
    const toast = useToast()

    return {
        toast,
        apiResponseToast: (data: any, handle?: apiResponseToastHandle) => {
            const onSuccess = handle?.onSuccess;
            const onFailure = handle?.onFailure;

            if (!data.success) {
                toast({
                    title: `Gagal`,
                    description: data.message,
                    status: 'error',
                });
                if (onFailure) onFailure();
            } else {
                toast({
                    title: `Sukses`,
                    description: data.message,
                    status: 'success',
                });
                if (onSuccess) onSuccess();
            }
        }
    }
}
