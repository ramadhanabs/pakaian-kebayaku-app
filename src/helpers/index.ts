import moment from "moment"
import "moment/locale/id"
moment.locale("id")

export const formatRupiah = (value: number | null | undefined) => {
  if (!value && value !== 0) return ""

  return new Intl.NumberFormat(`id-ID`, {
    currency: `IDR`,
    style: "currency",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

export const formatDate = (date: Date) => {
  if(!date) return ""
  
  return moment(date).format("LL")
}