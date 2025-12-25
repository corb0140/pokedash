import { useState } from 'react'
import { useModalAnimation } from '@/hooks/useModalAnimation'

type Props = {
  onClose: () => void
  onSubmit: (currentPassword: string, newPassword: string) => void
  isLoading?: boolean
}

function ChangePasswordModal({ onClose, onSubmit, isLoading }: Props) {
  const { modalRef, handleCloseModal } = useModalAnimation(onClose)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    onSubmit(currentPassword, newPassword)
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-page-background/70 flex items-center justify-center z-10"
    >
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-2xl font-semibold">Change Password</h2>

        {/* INPUTS */}
        <div className="flex flex-col gap-5 mt-5">
          <input
            type="password"
            placeholder="Current password"
            className="input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 bg-link text-white p-2 rounded-lg"
            onClick={handleCloseModal}
          >
            Cancel
          </button>

          <button
            disabled={isLoading}
            className="flex-1 bg-active-link text-white p-2 rounded-lg"
            onClick={handleSubmit}
          >
            {isLoading ? 'Updating…' : 'Update Password'}
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="text-sm text-type-fire mt-5">{error}</p>}
      </div>
    </div>
  )
}

export default ChangePasswordModal
