import * as React from 'react'
import { Dialog as TDialog, Transition } from '@headlessui/react'

interface Props {
  isOpen: boolean
  setIsOpen(val: boolean): void
  title: string
  children?: React.ReactNode
  actions?: React.ReactNode | null
}

function Dialog(props: Props): JSX.Element {
  const { isOpen, setIsOpen, title, actions, children } = props
  function closeModal(): void {
    setIsOpen(false)
  }

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <TDialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child as={React.Fragment} enter="ease-in duration-1000">
            <TDialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <TDialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {title}
              </TDialog.Title>
              <div className="mt-2 overflow-y-auto max-h-96">{children}</div>
              <div className="mt-4">{actions}</div>
            </div>
          </Transition.Child>
        </div>
      </TDialog>
    </Transition>
  )
}

export default Dialog
