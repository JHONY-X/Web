import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, emptyMessage = "No records found." }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-slate-700">
                    {/* If custom cell renderer exists, use it, else render raw value */}
                    {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}