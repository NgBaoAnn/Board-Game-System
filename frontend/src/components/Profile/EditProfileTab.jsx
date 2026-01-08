import { useState } from 'react'
import { Form, Input, Button, Upload, message, Avatar } from 'antd'
import { Camera, MapPin, Mail, User, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Joi from 'joi'
import { joiValidator } from '@/utils/validation'

const { TextArea } = Input

// Validation schema
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

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // TODO: Implement save profile API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave?.({ ...values, avatar: avatarUrl })
      message.success('Profile updated successfully!')
    } catch (error) {
      message.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // Get uploaded URL from response
      const url = info.file.response?.url || URL.createObjectURL(info.file.originFileObj)
      setAvatarUrl(url)
      message.success('Avatar uploaded!')
    }
  }

  const beforeUpload = (file) => {
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
    // For demo, create preview URL
    setAvatarUrl(URL.createObjectURL(file))
    return false // Prevent actual upload in demo
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
              beforeUpload={beforeUpload}
              onChange={handleAvatarChange}
            >
              <button className="absolute bottom-0 right-0 bg-[#1d7af2] text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
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

          {/* Password Link */}
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

          {/* Actions */}
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
