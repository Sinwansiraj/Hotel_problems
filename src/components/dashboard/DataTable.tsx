import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, onRowClick, keyExtractor, emptyMessage = 'No data available' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">{emptyMessage}</td></tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn('transition-colors hover:bg-accent/50', onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
