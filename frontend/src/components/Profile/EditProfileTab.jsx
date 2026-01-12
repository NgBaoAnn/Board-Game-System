import { useState } from 'react'
import { Form, Input, Button, Upload, message, Avatar, Modal } from 'antd'
import { Camera, MapPin, Mail, User, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Joi from 'joi'
import { joiValidator } from '@/utils/validation'
import uploadApi from '@/api/api-upload'
import { userApi } from '@/api/user'
import { useAuth } from '@/store/useAuth'

const { TextArea } = Input

const profileSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be less than 30 characters',
    'string.empty': 'Username is required',
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Please enter a valid email',
    'string.empty': 'Email is required',
  }),
  bio: Joi.string().max(200).allow('').messages({
    'string.max': 'Bio must be less than 200 characters',
  }),
  location: Joi.string().max(50).allow('').messages({
    'string.max': 'Location must be less than 50 characters',
  }),
})

export function EditProfileTab({ profile, onSave }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar)
  const [uploading, setUploading] = useState(false)
  const { user, setUser } = useAuth()
  
  // Preview states
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      await onSave?.({ ...values, avatar: avatarUrl })
      message.success('Profile updated successfully!')
    } catch (error) {
      message.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Select file and show preview
  const handleFileSelect = (file) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload image files!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
      return false
    }

    // Create preview URL and show modal
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setPendingFile(file)
    setPreviewVisible(true)
    
    return false // Prevent auto upload
  }

  // Step 2: Confirm and upload
  const handleConfirmUpload = async () => {
    if (!pendingFile || !user?.id) return

    setUploading(true)
    try {
      // Step 1: Upload the image file
      const response = await uploadApi.uploadAvatar(pendingFile)
      const newAvatarUrl = response.data?.url || response.data?.avatar_url || response.url
      
      if (newAvatarUrl) {
        // Step 2: Update user profile with new avatar_url
        await userApi.updateUser(user.id, { avatar_url: newAvatarUrl })
        
        // Update local state
        setAvatarUrl(newAvatarUrl)
        
        // Update auth store so header avatar updates
        setUser({ ...user, avatar_url: newAvatarUrl })
        
        message.success('Avatar updated successfully!')
      } else {
        // Fallback to preview URL if no URL returned
        setAvatarUrl(previewUrl)
        message.success('Avatar updated!')
      }
      
      setPreviewVisible(false)
      setPendingFile(null)
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      message.error(error.message || 'Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  // Cancel preview
  const handleCancelPreview = () => {
    setPreviewVisible(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setPendingFile(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h3>

        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Avatar src={avatarUrl} size={100} className="border-4 border-gray-100 dark:border-gray-700" />
            <Upload
              showUploadList={false}
              beforeUpload={handleFileSelect}
              accept="image/*"
            >
              <button 
                className="absolute bottom-0 right-0 bg-[#1d7af2] text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Camera size={16} />
              </button>
            </Upload>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Profile Photo</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>

        {/* Avatar Preview Modal */}
        <Modal
          open={previewVisible}
          onCancel={handleCancelPreview}
          footer={null}
          centered
          width={480}
          closable={false}
          className="avatar-preview-modal"
        >
          <div className="text-center">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Profile Picture</h3>
              <button
                onClick={handleCancelPreview}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Preview Image */}
            <div className="mb-6">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-full border-4 border-[#1d7af2] shadow-lg"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                This is how your profile picture will look
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                size="large"
                onClick={handleCancelPreview}
                className="px-6 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleConfirmUpload}
                loading={uploading}
                className="px-6 rounded-lg bg-[#1d7af2] hover:bg-blue-600"
              >
                {uploading ? 'Uploading...' : 'Save Photo'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: profile?.name || '',
            email: profile?.email || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
          }}
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="username"
              label={<span className="font-semibold text-gray-700 dark:text-gray-300">Username</span>}
              rules={[joiValidator(profileSchema.extract('username'))]}
            >
              <Input
                prefix={<User className="text-gray-400" size={18} />}
                placeholder="Your username"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="font-semibold text-gray-700 dark:text-gray-300">Email</span>}
              rules={[joiValidator(profileSchema.extract('email'))]}
            >
              <Input
                prefix={<Mail className="text-gray-400" size={18} />}
                placeholder="you@example.com"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="location"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Location</span>}
            rules={[joiValidator(profileSchema.extract('location'))]}
          >
            <Input
              prefix={<MapPin className="text-gray-400" size={18} />}
              placeholder="City, Country"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Bio</span>}
            rules={[joiValidator(profileSchema.extract('bio'))]}
          >
            <TextArea
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={200}
              showCount
              className="rounded-lg"
            />
          </Form.Item>

          {/* Password Section */}
          <div className="py-4 mb-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Password</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Change your password in settings
                </p>
              </div>
              <Link
                to="/settings"
                className="text-[#1d7af2] hover:underline text-sm font-medium"
              >
                Go to Settings →
              </Link>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button size="large" className="rounded-lg px-6">
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              className="rounded-lg px-6 bg-[#1d7af2] hover:bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default EditProfileTab
