import Container from "@/components/container/Container"
import { formatRupiah } from "@/helpers"
import { useProductList, useProductType } from "@/query"
import { ProductType } from "@/types/common"
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { ChangeEvent, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import db from "@/firebase/firebaseInit"

import es from "date-fns/locale/id"
import DatePicker, { registerLocale } from "react-datepicker"
registerLocale("es", es)

type FormValues = {
  fullname: string
  phone_number: string
  address: string
  date_of_use: Date
  event: string
  social_media: string
  down_payment_value: string
}

const CreateOrderPage = () => {
  const toast = useToast()
  const router = useRouter()
  const { data: dataProducts, isLoading: isLoadingProducts } = useProductList()
  const { data: dataProductType, isLoading: isLoadingProductType } = useProductType()

  const [selectedFile, setSelectedFile] = useState<File | null>()
  const [preview, setPreview] = useState("")
  const [filter, setFilter] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  })

  const filteredProduct = useMemo(() => {
    if (!filter) return dataProducts

    return dataProducts?.filter(item => item.type === filter)
  }, [filter, dataProducts])

  const handleInputFile = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event?.target?.files[0])
  }

  const onSubmit = async (data: FormValues) => {
    const seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
    const currentDate = new Date().toLocaleDateString("en-US")
    const payload = {
      order_id: `SO-${currentDate}-${seq}`,
      admin: "Evana Stevani",
      date_of_use: data.date_of_use,
      down_payment_value: parseInt(data.down_payment_value),
      tenant_data: {
        address: data.address,
        event: data.event,
        identity_url: "",
        instagram: data.social_media,
        name: data.fullname,
        phone_number: data.phone_number,
      },
      product: selectedProduct,
    }

    const database = db.collection("orders").doc()
    await database
      .set(payload)
      .then(() => toast({ title: "Sukses menambahkan produk", colorScheme: "green" }))
      .catch(() => toast({ title: "Gagal menambahkan produk", colorScheme: "red" }))
  }

  const productListRenderer = () => {
    if (isLoadingProducts)
      return (
        <Flex alignItems="center" gap={2} justifyContent="center">
          <Spinner />
          <Text fontSize="sm" fontWeight={600}>
            Loading data...
          </Text>
        </Flex>
      )
    return (
      <>
        {filteredProduct?.map(product => (
          <Box padding="8px" _hover={{ background: "gray.50" }} key={product.id}>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center" gap="8px">
                <Box border="1px" borderColor="gray.100" padding="4px" borderRadius="4px">
                  <img
                    src={product.image_url}
                    alt=""
                    width="50px"
                    style={{ objectFit: "cover", height: "50px" }}
                  />
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.400">
                    {product.id}
                  </Text>
                  <Text fontWeight="700">{product.name}</Text>
                  <Text fontSize="sm" color="gray.400">
                    {formatRupiah(product.price)}
                  </Text>
                </Box>
              </Flex>
              {selectedProduct?.id === product.id ? (
                <Button colorScheme="red" onClick={() => setSelectedProduct(null)}>
                  Batal
                </Button>
              ) : (
                <Button colorScheme="teal" onClick={() => setSelectedProduct(product)}>
                  Pilih
                </Button>
              )}
            </Flex>
          </Box>
        ))}
      </>
    )
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreview("")
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="600">
          Add New Order
        </Text>
      </Flex>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box padding={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">PIC - Admin</Text>
              <Input value="Evana Stevani" disabled />
            </Flex>

            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Tanggal Sewa</Text>
              <Controller
                control={control}
                name="date_of_use"
                render={({ field }) => (
                  <DatePicker
                    dateFormatCalendar="yyyy-MM-dd"
                    placeholderText="Pilih tanggal sewa"
                    onChange={date => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </Flex>

            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Nama Penyewa</Text>
              <Input
                placeholder="Masukkan Nama Penyewa"
                {...register("fullname", {
                  required: { value: true, message: "Masukkan Nama Penyewa" },
                })}
              />
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Nomor Handphone</Text>
              <Input
                placeholder="Masukkan Nomor Handphone"
                {...register("phone_number", {
                  required: { value: true, message: "Masukkan Nomor Handphone" },
                })}
              />
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Alamat</Text>
              <Textarea
                placeholder="Masukkan alamat"
                {...register("address", {
                  required: { value: true, message: "Masukkan Alamat" },
                })}
              />
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Acara</Text>
              <Input
                placeholder="Masukkan acara"
                {...register("event", {
                  required: { value: true, message: "Masukkan acara" },
                })}
              />
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Sosmed (Instagram)</Text>
              <Input
                placeholder="Masukkan akun instagram penyewa"
                {...register("social_media", {
                  required: { value: true, message: "Masukkan sosmed" },
                })}
              />
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Down Payment (DP)</Text>
              <InputGroup>
                <InputLeftAddon>Rp</InputLeftAddon>
                <Input
                  placeholder="Masukkan Jumlah DP"
                  type="number"
                  {...register("down_payment_value", {
                    required: { value: true, message: "Masukkan sosmed" },
                  })}
                />
              </InputGroup>
            </Flex>

            <Flex gap={2} mt={8}>
              <Button colorScheme="gray" onClick={() => router.back()}>
                Batal
              </Button>
              <Button colorScheme="teal" type="submit">
                Simpan
              </Button>
            </Flex>
          </form>
        </Box>
        <Box padding={2}>
          <Flex direction="column" gap="2" mb={4}>
            <Text fontSize="sm">Foto Identitas (KTP/SIM/Kartu Pelajar)</Text>

            <Box
              border="1px"
              borderColor="gray.300"
              borderRadius="8px"
              padding="8px"
              width="full"
              mb="8px"
              gridColumn={2}
            >
              <img src={preview} width="200px" style={{ marginBottom: "18px" }} />
              <input placeholder="Masukkan Foto Identitas" type="file" onChange={handleInputFile} />
            </Box>
          </Flex>
          <Flex direction="column" gap="2" mb={4}>
            <Text fontSize="sm">Pilih Produk</Text>
            <Select
              placeholder="Kategori"
              disabled={isLoadingProductType}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value)}
            >
              {dataProductType?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Box
              border="1px"
              borderColor="gray.100"
              padding={4}
              borderRadius="md"
              height="400px"
              position="relative"
            >
              {productListRenderer()}

              {selectedProduct && (
                <Box
                  position="absolute"
                  bottom="0px"
                  left="0px"
                  width="100%"
                  bg="teal"
                  padding="4px 16px"
                  borderBottomRadius="md"
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize="xs" color="white">
                      Produk dipilih:
                    </Text>
                    <Box>
                      <Text fontWeight={700} color="white" textAlign="right">
                        {`${selectedProduct?.name} (${selectedProduct?.id})`}
                      </Text>
                      <Text fontSize="xs" color="white" textAlign="right">
                        {formatRupiah(selectedProduct.price)}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      </Grid>
    </Container>
  )
}

export default CreateOrderPage
