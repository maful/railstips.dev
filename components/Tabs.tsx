import React from 'react'

interface Category {
  id: number;
  title: string;
  position: number;
}

type OnChangeFn = (id: number) => void;

interface TabsProps {
  categories: Category[];
  activeTab?: number;
  onChange: OnChangeFn;
}

const Tabs = (props: TabsProps): JSX.Element => {
  const { categories, activeTab, onChange } = props

  return (
    <ul className="flex flex-row gap-4 my-4 font-medium">
      {categories.map((cat, index) => (
        <li key={index}>
          <a
            onClick={() => onChange(cat.id)}
            className={`p-3 cursor-pointer text-gray-600 hover:bg-red-500 hover:text-white rounded-lg ${cat.id === activeTab ? 'bg-red-300 bg-opacity-50 text-red-700' : null}`}
          >
            {cat.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default Tabs
