interface DropdownOption {
  text: string;
  Icon: React.ComponentType<{className?: string}>;
  action?: () => void;
}

export default function DropdownList({options}: {options: DropdownOption[]}) {
  return (
    <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
      <div className="py-1">
        {options.map((option, index) => (
          <button
            key={index}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={option.action}
          >
            <option.Icon className="w-4 h-4 mr-3" />
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
