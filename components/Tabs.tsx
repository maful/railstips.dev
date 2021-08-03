import { Category } from 'lib/models/category'
import React from 'react'

type OnChangeFn = (id: string) => void;

interface TabsProps {
  categories: Category[];
  activeTab?: string;
  onChange: OnChangeFn;
}

const Tabs = (props: TabsProps): JSX.Element => {
  const { categories, activeTab, onChange } = props

  return (
    <ul className="flex flex-row gap-4 my-4 font-medium">
      {categories && categories.map((cat, index) => (
        <li key={index}>
          <a
            onClick={() => onChange(cat.id)}
            className={`p-3 cursor-pointer text-gray-600 hover:bg-red-500 hover:text-white rounded-lg ${cat.id === activeTab ? 'bg-red-300 bg-opacity-50 text-red-600' : null}`}
          >
            {cat.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default Tabs
