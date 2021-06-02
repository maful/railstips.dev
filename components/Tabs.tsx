import * as React from 'react'

interface TabsProps {
  categories: string[];
  activeTab?: number;
}

const Tabs = (props: TabsProps): JSX.Element => {
  const { categories, activeTab } = props

  return (
    <ul className="flex flex-row gap-4 my-4 font-medium">
      {categories.map((category, index) => (
        <li key={index}>
          <a className={`p-3 cursor-pointer text-gray-600 hover:bg-red-500 hover:text-white rounded-lg ${index === activeTab ? 'bg-red-300 bg-opacity-50 text-red-700' : null}`}>{category}</a>
        </li>
      ))}
    </ul>
  )
}

export default Tabs
