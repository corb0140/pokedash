import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useAuthMutations } from '@/queries/useAuth'
import { profilePageRoute } from '@/routes/profile-page'
import HandleDeleteModal from '@/components/Modals/HandleDeleteModal'
import ChangePasswordModal from '@/components/Modals/ChangePasswordModal'
import { useAuth } from '@/stores/authStore'

function ProfilePage() {
  const navigate = useNavigate()
  const { logout, deleteAccount, changeUsername, changePassword } =
    useAuthMutations()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const user = useAuth.getState().user
  const [editingUsername, setEditingUsername] = useState(false)
  const [username, setUsername] = useState(user?.username ?? '')

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' })
      },
    })
  }

  const handleDeleteAccount = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/' })
      },
    })
  }

  const { isAuthenticated } = profilePageRoute.useLoaderData()

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        navigate({
          to: '/login',
          search: { redirect: location.pathname },
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="h-[85vh] flex items-center justify-center">
        <div className="text-lg font-medium flex flex-col items-center my-auto">
          <Icon icon="arcticons:pokemon-smile" className="mb-5 h-40 w-40" />

          <p>You must log in to view this page.</p>
          <p>Redirecting to login…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:px-20 flex flex-col">
      <div className="mt-5 w-full flex flex-col md:items-center">
        <div>
          <h1 className="text-5xl uppercase font-bold mb-2">Profile</h1>
          <p className="text-info-text lg:text-sm md:text-center font-semibold">
            Manage your account
          </p>
        </div>

        {/* AVATAR AND USERNAME */}
        <div className="flex md:flex-col items-center gap-5 mt-10">
          <div className="w-24 h-24 lg:w-30 lg:h-30 rounded-full bg-active-link flex items-center justify-center text-5xl font-bold text-white">
            {user?.username.charAt(0).toUpperCase()}
          </div>

          <span className="text-3xl font-semibold">{user?.username}</span>
        </div>
      </div>

      <div className="mt-10 rounded-xl flex flex-col md:items-center">
        <h2 className="text-3xl font-semibold mb-5">Account Settings</h2>

        {/* USERNAME */}
        <div className="mb-4 md:w-[clamp(200px,50%,400px)]">
          <label className="text-sm font-medium">Username</label>

          {editingUsername ? (
            <div className="flex gap-2 mt-1">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input flex-1"
              />

              <button
                className="text-info-text"
                onClick={() => {
                  changeUsername.mutate(
                    { username },
                    {
                      onSuccess: () => {
                        setEditingUsername(false)
                      },
                    },
                  )
                }}
              >
                Save
              </button>

              <button
                className="text-hp"
                onClick={() => {
                  setUsername(user!.username)
                  setEditingUsername(false)
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-1">
              <span>{user?.username}</span>
              <button
                className="text-active-link lg:text-sm"
                onClick={() => setEditingUsername(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* CHANGE PASSWORD */}
        <div className="mb-4 md:w-[clamp(200px,50%,400px)]">
          <label className="text-sm font-medium">Password</label>
          <div className="flex justify-between items-center mt-1">
            <span>********</span>
            <button
              className="text-active-link lg:text-sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col md:mx-auto gap-4 mt-10 md:w-[clamp(200px,50%,400px)]">
        <span className="pb-2 border-b border-b-info-text text-2xl text-hp font-semibold">
          Danger Zone
        </span>

        <button
          disabled={logout.isPending}
          className="bg-info-text p-2 rounded-lg text-white"
          onClick={handleLogout}
        >
          {logout.isPending ? 'Logging out…' : 'Logout'}
        </button>

        <button
          className="bg-type-fire p-2 px-10 rounded-lg text-white"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>

      {/* Modal */}
      {showDeleteModal && (
        <HandleDeleteModal
          onClose={() => setShowDeleteModal(false)}
          handleDeleteAccount={handleDeleteAccount}
          isDeleting={deleteAccount.isPending}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={(currentPassword, newPassword) => {
            changePassword.mutate(
              { currentPassword, newPassword },
              {
                onSuccess: () => setShowPasswordModal(false),
              },
            )
          }}
          isLoading={changePassword.isPending}
        />
      )}
    </div>
  )
}

export default ProfilePage
