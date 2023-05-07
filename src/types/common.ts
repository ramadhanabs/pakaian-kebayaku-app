export interface ProductType {
  id: string
  type: string
  image_url: string
  owner: string
  price: number
  dimention: Dimention
  name: string
}

export interface Dimention {
  chest_size: number
  body_weight: number
  body_height: number
}

export interface ProductTypeOption {
  value: string
  code: string
  label: string
}

export interface OrderType {
  admin: string
  id: string
  order_id: string
  down_payment_value: string
  tenant_data: TenantData
  date_of_use: DateOfUse
  product: ProductType
}

export interface TenantData {
  name: string
  instagram: string
  event: string
  identity_url: string
  phone_number: string
  address: string
}

export interface DateOfUse {
  seconds: number
  nanoseconds: number
}