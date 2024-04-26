export const fetcher = (...args: Parameters<typeof fetch>) => {
    console.log(45678)
   return  fetch(...args).then(res => res.json())
}

