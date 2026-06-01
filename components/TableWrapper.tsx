const TableWrapper = ({ children }) => {
  return (
    <div className="w-full overflow-hidden rounded border border-gray-200 dark:border-gray-700">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        style={{ tableLayout: 'fixed' }}
      >
        {children}
      </table>
    </div>
  )
}

export default TableWrapper
