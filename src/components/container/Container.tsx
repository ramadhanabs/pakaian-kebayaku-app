import { Box } from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"

const Container = (props: PropsWithChildren) => {
  return (
    <Box width="full" height="full" bg="white" borderRadius="8px" padding="16px">
      {props.children}
    </Box>
  )
}

export default Container
