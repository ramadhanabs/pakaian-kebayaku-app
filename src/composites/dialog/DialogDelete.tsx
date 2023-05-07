import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
  Input,
} from "@chakra-ui/react"
import React, { RefObject, useState } from "react"

interface DialogDeleteProps {
  isOpen: boolean
  cancelRef: any
  onClose: () => void
  title: string
  handleDelete: () => void
}

const DialogDelete = (props: DialogDeleteProps) => {
  const { isOpen, cancelRef, onClose, title, handleDelete } = props
  const [confirmationText, setConfirmationText] = useState("")

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            <Box>
              <Text mb={3}>Yakin menghapus data? Aksi ini tidak bisa diulang.</Text>
              <Input
                onChange={event => setConfirmationText(event?.target.value)}
                value={confirmationText}
              />
              <Text fontSize="xs" color="red">Ketik "HAPUS" untuk mengkonfirmasi.</Text>
            </Box>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Batal
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              ml={3}
              isDisabled={confirmationText !== "HAPUS"}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DialogDelete
