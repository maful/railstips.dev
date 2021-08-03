import { ExclamationCircleIcon } from 'components/icons'

interface Props {
  children: React.ReactNode
}

function Alert({ children }: Props): JSX.Element {
  return (
    <div className="w-full text-white bg-red-500 rounded-lg">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <div className="flex">
          <ExclamationCircleIcon className="mr-3 w-6 h-6 fill-current" />
          {children}
        </div>
      </div>
    </div>
  )
}

export default Alert
