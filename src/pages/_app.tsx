import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import "@/styles/globals.css"
import Sidebar from "@/components/layouts/Sidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "react-datepicker/dist/react-datepicker.css"
import "@/styles/react-datepicker.css"

const client = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
})

export default function App({ Component, pageProps }: AppProps) {
  const theme = extendTheme({
    colors: {
      "japandi-white": "#f3f0e8",
      "japandi-gray": "#e6e4e0",
      "japandi-green-1": "#b9b99d",
      "japandi-green-2": "#606c5a",
      "japandi-orange": "#dcb482",
      "japandi-cream": "#e0cfc3",
      "japandi-teal": "b0b9a8",
      "japandi-brown": "c09e85",
    },
  })

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
      <ChakraProvider theme={theme}>
        <Sidebar>
          <Component {...pageProps} />
        </Sidebar>
      </ChakraProvider>
    </QueryClientProvider>
  )
}
