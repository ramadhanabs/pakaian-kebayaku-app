import Container from "@/components/container/Container"
import {
  Flex,
  Text,
  Button,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import db from "@/firebase/firebaseInit"
import { ProductType } from "@/types/common"
import { formatRupiah } from "@/helpers"

const ProductsPage = () => {
  const [dataProducts, setDataProducts] = useState<ProductType[]>([])

  const fetchData = async () => {
    try {
      const getData = db.collection("products")
      const snapshot = await getData.get()
      const data = snapshot.docs.map(item => {
        return item.data()
      })
      setDataProducts(data as ProductType[])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="600">
          Product List
        </Text>
        <Link href="/products/create">
          <Button colorScheme="teal">Add Product</Button>
        </Link>
      </Flex>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataProducts.map(item => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.type}</Td>
                <Td>{formatRupiah(item.price)}</Td>
                <Td display="flex" gap={2}>
                  <Button colorScheme="teal" size="sm">
                    Edit
                  </Button>
                  <Button colorScheme="red" size="sm">
                    Hapus
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default ProductsPage
