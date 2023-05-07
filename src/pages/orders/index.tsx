import Container from "@/components/container/Container"
import {
  Button,
  Flex,
  Link,
  Text,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  IconButton,
  useToast,
  Spinner,
  Box,
} from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import db from "@/firebase/firebaseInit"
import { formatDate, formatRupiah } from "@/helpers"
import { ViewIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import DialogDelete from "@/composites/dialog/DialogDelete"
import { useOrderList } from "@/query"

const OrdersPage = () => {
  const [idToBeDelete, setIdToBeDelete] = useState("")

  const { data: dataOrders, isLoading: isLoadingOrders, refetch } = useOrderList()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()

  const onOpenDialogDelete = (id: string) => {
    setIdToBeDelete(id)
    onOpen()
  }

  const onCloseDialogDelete = () => {
    setIdToBeDelete("")
    onClose()
  }

  const handleDelete = async () => {
    await db
      .collection("orders")
      .doc(idToBeDelete)
      .delete()
      .then(() => {
        toast({ title: "Sukses menghapus order", colorScheme: "green" })
        onCloseDialogDelete()
        refetch()
      })
      .catch(() => toast({ title: "Gagal menghapus order", colorScheme: "red" }))
  }

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="600">
          Order List
        </Text>
        <Link href="/orders/create">
          <Button colorScheme="teal">Add Order</Button>
        </Link>
      </Flex>

      {isLoadingOrders ? (
        <Flex alignItems="center" justifyContent="center" direction="column">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" mb={3} />
          <Text>Loading data...</Text>
        </Flex>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Tanggal Sewa</Th>
                <Th>Nama Kebaya</Th>
                <Th>Nama Penyewa</Th>
                <Th>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataOrders?.map(item => (
                <Tr key={item.id}>
                  <Td>{item.order_id}</Td>
                  <Td>{formatDate(new Date(item.date_of_use.seconds * 1000))}</Td>
                  <Td>{item.product.name}</Td>
                  <Td>{item.tenant_data.name}</Td>
                  <Td>{formatRupiah(item.product.price)}</Td>
                  <Td display="flex" gap={2}>
                    <IconButton aria-label="button-detail" icon={<ViewIcon />} />
                    <IconButton aria-label="button-edit" icon={<EditIcon />} colorScheme="teal" />
                    <IconButton
                      aria-label="button-delete"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => onOpenDialogDelete(item.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <DialogDelete
        isOpen={isOpen}
        onClose={onCloseDialogDelete}
        cancelRef={cancelRef}
        title="Delete Order"
        handleDelete={handleDelete}
      />
    </Container>
  )
}

export default OrdersPage
