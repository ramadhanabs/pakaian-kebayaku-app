import db from "@/firebase/firebaseInit"
import { OrderType, ProductType, ProductTypeOption } from "@/types/common"

export const getDataProducts = async () => {
  try {
    const getData = db.collection("products")
    const snapshot = await getData.get()
    return snapshot.docs.map(item => item.data()) as ProductType[]
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getAllTypeProduct = async () => {
  try {
    const getData = db.collection("type_products")
    const snapshot = await getData.get()
    return snapshot.docs.map(item => item.data()) as ProductTypeOption[]
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getDataOrders = async () => {
  try {
    const getData = db.collection("orders")
    const snapshot = await getData.get()
    return snapshot.docs.map(item => {
      return {
        id: item.id,
        ...item.data(),
      }
    }) as OrderType[]
  } catch (error: any) {
    throw new Error(error)
  }
}
