// packages/providers/src/modal/useModal.ts

import { useModalContext } from './ModalProvider'

export const useModal = () => {
  const { showModal, hideModal } = useModalContext()
  return { showModal, hideModal }
}
