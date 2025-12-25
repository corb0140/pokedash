import { useModalAnimation } from '@/hooks/useModalAnimation'

export type DeleteModalProps = {
  handleDeleteAccount: () => void
  onClose: () => void
  isDeleting?: boolean
}

function HandleDeleteModal({
  handleDeleteAccount,
  onClose,
  isDeleting,
}: DeleteModalProps) {
  const { modalRef, handleCloseModal } = useModalAnimation(onClose)

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 w-full h-full bg-page-background/70 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg w-80 shadow-sm mx-auto">
        <h2 className="text-lg font-bold mb-4">Delete Account</h2>
        <p className="mb-6">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-link text-white"
            onClick={handleCloseModal}
          >
            Cancel
          </button>

          <button
            disabled={isDeleting}
            className="px-4 py-2 rounded bg-hp text-white"
            onClick={handleDeleteAccount}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HandleDeleteModal
