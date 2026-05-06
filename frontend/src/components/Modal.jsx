import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden 
                rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl transition-all
                max-h-[90vh] sm:max-h-[85vh] flex flex-col`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex-shrink-0">
                  {/* Mobile drag indicator */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
                  <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-900 pt-1 sm:pt-0">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Tutup modal"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya, Lanjutkan', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
        <button onClick={onClose} className="btn-ghost w-full sm:w-auto justify-center">
          Batal
        </button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          className={`${danger ? 'btn-danger' : 'btn-primary'} w-full sm:w-auto justify-center`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}
