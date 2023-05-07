import { getAllTypeProduct, getDataOrders, getDataProducts } from "@/api/products"
import { useQuery } from "@tanstack/react-query"

export const useProductType = () => {
  return useQuery(["product-type"], () => getAllTypeProduct())
}

export const useProductList = () => {
  return useQuery(["product-list"], () => getDataProducts())
}

export const useOrderList = () => {
  return useQuery(["order-list"], () => getDataOrders())
}
