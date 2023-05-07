import Container from "@/components/container/Container"
import {
  Flex,
  Grid,
  Select,
  Text,
  Box,
  Input,
  Button,
  useToast,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import db from "@/firebase/firebaseInit"
import { ProductType } from "@/types/common"
import { useProductType } from "@/query"
import { storage } from "@/firebase/firebaseInit"
import { ref, uploadBytes } from "@firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { getDownloadURL } from "firebase/storage"

type FormValues = {
  code: string
  type: string
  owner: string
  name: string
  price: number
  body_weight: number
  body_height: number
  chest_size: number
  image_url: string
}

const CreateProductPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>()
  const [preview, setPreview] = useState("")
  const [code, setCode] = useState("")

  const { data: dataProductType, isLoading: isLoadingProductType } = useProductType()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  })
  const toast = useToast()
  const router = useRouter()

  const handleUpload = async () => {
    if (!selectedFile) return ""

    const fileFormat = selectedFile.name.split(".").pop()
    const imagePath = `images/${uuidv4()}.${fileFormat}`
    const imageRef = ref(storage, imagePath)

    try {
      const response = await uploadBytes(imageRef, selectedFile)
      return await getDownloadURL(response.ref)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const onSubmit = async (data: FormValues) => {
    const image_url = await handleUpload()
    const payload: ProductType = {
      id: `${code}-${data.code}`,
      dimention: {
        body_weight: data.body_weight,
        body_height: data.body_height,
        chest_size: data.chest_size,
      },
      name: data.name,
      type: data.type,
      price: data.price,
      owner: data.owner,
      image_url,
    }
    const database = db.collection("products").doc()
    await database
      .set(payload)
      .then(() => toast({ title: "Sukses menambahkan produk", colorScheme: "green" }))
      .catch(() => toast({ title: "Gagal menambahkan produk", colorScheme: "red" }))
  }

  const handleInputFile = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event?.target?.files[0])
  }

  const handleSelectProductType = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.selectedOptions[0].getAttribute("data-code")
    setCode(selectedCode || "")
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
          Add New Product
        </Text>
      </Flex>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box padding={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Kode Produk</Text>
              <InputGroup>
                <InputLeftAddon>{code || "--"}</InputLeftAddon>
                <Input
                  placeholder="Masukkan Kode Kebaya"
                  {...register("code", {
                    required: { value: true, message: "Masukkan Nama Kebaya" },
                  })}
                />
              </InputGroup>
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Tipe Kebaya</Text>
              <Select
                placeholder="Pilih Tipe Kebaya"
                {...register("type", {
                  required: { value: true, message: "Silahkan pilih tipe kebaya" },
                })}
                disabled={isLoadingProductType}
                onChange={handleSelectProductType}
              >
                {dataProductType?.map(option => (
                  <option key={option.value} value={option.value} data-code={option.code}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Pemilik</Text>
              <Select
                placeholder="Pilih Pemilik"
                {...register("owner", {
                  required: { value: true, message: "Silahkan pilih pemilik" },
                })}
              >
                <option value="inventory">Inventaris</option>
                <option value="consignment">Titip Sewa</option>
              </Select>
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Nama</Text>
              <Input
                placeholder="Masukkan Nama Kebaya"
                {...register("name", {
                  required: { value: true, message: "Masukkan Nama Kebaya" },
                })}
              />
            </Flex>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Harga</Text>
              <Input
                placeholder="Masukkan Harga Sewa"
                type="number"
                {...register("price", {
                  required: { value: true, message: "Masukkan Harga Kebaya" },
                })}
              />
            </Flex>
            <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
              <Flex direction="column" gap="2">
                <Text fontSize="sm">Berat Badan</Text>
                <Input
                  placeholder="Masukkan BB (kg)"
                  type="number"
                  {...register("body_weight", {
                    required: { value: true, message: "Masukkan BB" },
                  })}
                />
              </Flex>
              <Flex direction="column" gap="2">
                <Text fontSize="sm">Tinggi Badan</Text>
                <Input
                  placeholder="Masukkan TB (cm)"
                  type="number"
                  {...register("body_height", {
                    required: { value: true, message: "Masukkan TB" },
                  })}
                />
              </Flex>
              <Flex direction="column" gap="2">
                <Text fontSize="sm">Lingkar Dada</Text>
                <Input
                  placeholder="Masukkan LD (cm)"
                  type="number"
                  {...register("chest_size", {
                    required: { value: true, message: "Masukkan LD" },
                  })}
                />
              </Flex>
            </Grid>
            <Flex direction="column" gap="2" mb={4}>
              <Text fontSize="sm">Foto Produk</Text>
              <Input placeholder="Masukkan Foto Produk" type="file" onChange={handleInputFile} />
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
          {selectedFile && (
            <div>
              <Text fontSize="sm" mb={2}>
                Preview Image
              </Text>
              <Box
                border="1px"
                borderColor="gray.300"
                borderRadius="8px"
                padding="8px"
                width="max-content"
                mb="8px"
              >
                <img src={preview} width="200px" />
              </Box>
              <Button size="sm" colorScheme="red" onClick={() => setSelectedFile(null)}>
                Hapus
              </Button>
            </div>
          )}
        </Box>
      </Grid>
    </Container>
  )
}

export default CreateProductPage
