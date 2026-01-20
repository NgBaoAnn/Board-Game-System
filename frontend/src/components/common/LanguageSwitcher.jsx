import { useTranslation } from 'react-i18next'
import { Dropdown } from 'antd'
import { motion } from 'framer-motion'
import Globe from 'lucide-react/dist/esm/icons/globe'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'

/**
 * LanguageSwitcher Component
 * - Cho phép chuyển đổi ngôn ngữ EN/VI
 * - Lưu vào localStorage tự động thông qua i18next
 * - Hiển thị ngôn ngữ hiện tại
 */
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const currentLanguage = i18n.language?.split('-')[0] || 'en'

  const languageOptions = [
    {
      key: 'en',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-lg">🇺🇸</span>
          <span>English</span>
        </div>
      ),
    },
    {
      key: 'vi',
      label: (
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-lg">🇻🇳</span>
          <span>Tiếng Việt</span>
        </div>
      ),
    },
  ]

  const handleLanguageChange = ({ key }) => {
    i18n.changeLanguage(key)
  }

  const getCurrentFlag = () => {
    return currentLanguage === 'vi' ? '🇻🇳' : '🇺🇸'
  }

  const getCurrentLabel = () => {
    return currentLanguage === 'vi' ? 'VI' : 'EN'
  }

  return (
    <Dropdown
      menu={{
        items: languageOptions,
        onClick: handleLanguageChange,
        selectable: true,
        selectedKeys: [currentLanguage],
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer border-none"
      >
        <span className="text-base">{getCurrentFlag()}</span>
        <span className="text-sm font-medium hidden sm:inline">{getCurrentLabel()}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </motion.button>
    </Dropdown>
  )
}
