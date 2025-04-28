import { memo } from 'react'
import { classNames } from '../../../utils/classNames'
import type { FileModel } from '../../../types'
import { getFileIcon } from '../../utils'

export interface TabListProps {
  models: FileModel[]
  selectedPath: string
  onSelect: (path: string) => void
  onClose?: (path: string) => void
  className?: string
  style?: React.CSSProperties
}

export const TabList = memo(function TabList({
  models,
  selectedPath,
  onSelect,
  onClose,
  className,
  style,
}: TabListProps) {
  return (
    <div
      className={classNames(
        'flex bg-[#262626] text-[#F6F6F4] text-[12px] overflow-x-auto h-[32px] box-border',
        className,
      )}
      style={{
        fontFamily: 'Consolas, Monaco, monospace',
        ...style,
      }}
    >
      {models.map((model) => {
        const isSelected = model.path === selectedPath
        const fileName = model.path.split('/').pop() || ''

        return (
          <div
            key={model.path}
            className={classNames(
              'flex items-center py-[6px] px-[12px] border-r border-[#383838] min-w-[100px] max-w-[200px] box-border',
              'hover:bg-[#35363E] cursor-pointer relative group',
              isSelected && 'bg-[#35363E]',
            )}
            onClick={() => onSelect(model.path)}
          >
            <span className="mr-[6px]">{getFileIcon(fileName)}</span>
            <span className="truncate">{fileName}</span>
            {onClose && (
              <span
                className="ml-auto pl-[8px] opacity-0 group-hover:opacity-100 hover:text-[#FF5555]"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose(model.path)
                }}
              >
                ✕
              </span>
            )}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6272A4]"></div>
            )}
          </div>
        )
      })}
    </div>
  )
})
