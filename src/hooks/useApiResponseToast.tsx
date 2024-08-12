import { useToast } from "@chakra-ui/react";
import { AxiosResponse } from "axios";

type apiResponseToastHandle = {
    onSuccess?: () => any;
    onFailure?: () => any;
}

export function useApiResponseToast() {
    const toast = useToast()

    return {
        toast,
        apiResponseToast: (data: AxiosResponse, handle?: apiResponseToastHandle) => {
            const onSuccess = handle?.onSuccess;
            const onFailure = handle?.onFailure;

            if (data.status !== 200) {
                toast({
                    title: `Gagal`,
                    description: data.data,
                    status: 'error',
                });
                if (onFailure) onFailure();
            } else {
                toast({
                    title: `Sukses`,
                    description: data.data,
                    status: 'success',
                });
                if (onSuccess) onSuccess();
            }
        }
    }
}
