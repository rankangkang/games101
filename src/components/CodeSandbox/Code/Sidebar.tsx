import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { classNames } from '../../../utils/classNames'
import { Condition } from '../../Condition/Condition'
import type { SidebarConfig, MenuItem } from './Sidebar.types'

interface SidebarProps {
  config: SidebarConfig
}

export const Sidebar = ({ config }: SidebarProps) => {
  const [openPopover, setOpenPopover] = useState<string | null>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const popoverRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Store position information for popovers with dimensions
  const [popoverPositions, setPopoverPositions] = useState<
    Record<string, { top: number; height: number }>
  >({})

  // Calculate popover position when opened
  useEffect(() => {
    if (!openPopover) return

    const buttonEl = buttonRefs.current[openPopover]
    if (!buttonEl) return

    // Wait for the next frame to ensure the popover is rendered and get its height
    requestAnimationFrame(() => {
      const popoverEl = popoverRefs.current[openPopover]
      if (!popoverEl) return

      // Calculate positions
      const buttonRect = buttonEl.getBoundingClientRect()
      const popoverRect = popoverEl.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const popoverHeight = popoverRect.height

      let top = buttonRect.top

      // Check if popover would extend beyond the bottom of the viewport
      if (top + popoverHeight > viewportHeight) {
        // Align bottom of popover with bottom of viewport, with a small margin
        top = viewportHeight - popoverHeight - 16
      }

      // Ensure the popover doesn't go beyond the top of the viewport
      top = Math.max(16, top)

      setPopoverPositions((prev) => ({
        ...prev,
        [openPopover]: { top, height: popoverHeight },
      }))
    })
  }, [openPopover])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openPopover) return

      const buttonEl = buttonRefs.current[openPopover]
      const popoverEl = popoverRefs.current[openPopover]

      if (
        popoverEl &&
        !popoverEl.contains(e.target as Node) &&
        buttonEl &&
        !buttonEl.contains(e.target as Node)
      ) {
        setOpenPopover(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openPopover])

  // Close popovers on resize to recalculate positions
  useEffect(() => {
    const handleResize = () => {
      if (openPopover) {
        setOpenPopover(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [openPopover])

  // Callbacks for refs
  const setButtonRef = (id: string) => (el: HTMLButtonElement | null) => {
    buttonRefs.current[id] = el
  }

  const setPopoverRef = (id: string) => (el: HTMLDivElement | null) => {
    popoverRefs.current[id] = el
  }

  // Render a menu item button or link
  const renderMenuItem = (item: MenuItem) => {
    const isPopoverOpen = openPopover === item.id
    const popoverPosition = popoverPositions[item.id]

    // Common classNames for the item
    const itemClassNames = classNames(
      'w-8 h-8 flex items-center justify-center rounded focus:outline-none cursor-pointer',
      'text-[#F6F6F4] hover:bg-[#4a4a5e]',
    )

    const node = item.path ? (
      <Link key={item.id} to={item.path} className={itemClassNames} title={item.title}>
        {item.icon}
      </Link>
    ) : (
      <button
        key={item.id}
        ref={setButtonRef(item.id)}
        className={itemClassNames}
        title={item.title}
        aria-label={item.title}
        onClick={() => {
          setOpenPopover((prev) => (prev === item.id ? null : item.id))
          item.onClick?.()
        }}
      >
        {item.icon}
      </button>
    )
    return (
      <div key={item.id} className="relative">
        {node}
        {/* Popover content - Initially render with opacity 0 to measure, then position it correctly */}
        <Condition if={isPopoverOpen && item.items}>
          <div
            ref={setPopoverRef(item.id)}
            className={classNames(
              'fixed left-12 w-64 bg-[#B9B9B8] shadow-lg rounded-md overflow-hidden z-50',
              'p-2 text-[#383838]',
              popoverPosition ? 'opacity-100' : 'opacity-0', // Only show when positioned
              isPopoverOpen ? 'block' : 'hidden',
              'shadow-lg shadow-black/20',
            )}
            style={{
              top: popoverPosition?.top || 0,
              transition: 'opacity 0.1s ease-in-out',
            }}
          >
            <h3 className="text-sm font-medium text-[#1C1C1C] rounded-md px-2 py-1">
              {item.title}
            </h3>
            <div className="border-b border-b-[#A5A5A5] my-1" />
            <div className="overflow-y-auto max-h-[50vh]">
              <ul className="">
                {item.items?.map((subItem) => {
                  const subItemClassNames = classNames(
                    'block w-full text-left py-1 px-2 transition-colors text-[12px]',
                    'hover:bg-[#336CCC] hover:text-[#1C1C1C] rounded-md',
                  )
                  const node = subItem.path ? (
                    <Link
                      to={subItem.path}
                      className={subItemClassNames}
                      onClick={() => {
                        setOpenPopover(null)
                        subItem.onClick?.()
                      }}
                    >
                      {subItem.title}
                    </Link>
                  ) : (
                    <button
                      className={subItemClassNames}
                      onClick={() => {
                        setOpenPopover(null)
                        subItem.onClick?.()
                      }}
                    >
                      {subItem.title}
                    </button>
                  )
                  return <li key={subItem.id}>{node}</li>
                })}
              </ul>
            </div>
          </div>
        </Condition>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Fixed sidebar */}
      <div className="w-12 h-full bg-[#353745] flex flex-col items-center py-4">
        {/* Top section */}
        <div className="flex flex-col items-center gap-6">{config.top.map(renderMenuItem)}</div>

        {/* Bottom section - push items to the bottom */}
        <div className="flex flex-col items-center gap-6 mt-auto">
          {config.bottom.map(renderMenuItem)}
        </div>
      </div>
    </div>
  )
}
