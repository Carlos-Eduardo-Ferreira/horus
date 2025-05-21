import React, { ReactNode } from "react";
import Title from "@/components/Title";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import ActionButton from '@/components/ActionButton';
import { GoPencil } from "react-icons/go";
import { TiPlus } from "react-icons/ti";
import Alert from '@/components/Alert';
import { FaInfoCircle, FaFilter } from "react-icons/fa";
import { Tooltip } from "@/components/Tooltip";

export type ListTableColumn<T> = {
  key: keyof T;
  label: string;
  widthPercent: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export type ListTableProps<T> = {
  columns: ListTableColumn<T>[];
  data: T[];
  title: string;
  buttonText?: string;
  onNewClick?: () => void;
  basePath: string;
  customActions?: (row: T) => React.ReactNode;
  onDelete?: (id: number) => void;
  actionsColumnWidth?: number;
  onFilter?: () => void;
};

export function ListTable<T extends { id: number }>({
  columns: userColumns,
  data,
  title,
  buttonText = "Inserir Novo",
  onNewClick,
  basePath,
  customActions,
  onDelete,
  actionsColumnWidth = 0,
  onFilter,
}: ListTableProps<T>) {
  const router = useRouter();
  
  const columns = [
    ...userColumns,
    {
      key: 'actions' as keyof T,
      label: 'Ações',
      widthPercent: actionsColumnWidth,
      align: 'center' as const,
      render: (_value: T[keyof T], row: T) => (
        <div className="flex gap-2 justify-center">
          <Tooltip content="Editar">
            <ActionButton
              icon={GoPencil as React.ForwardRefExoticComponent<React.ComponentProps<'svg'>>}
              color="primary"
              onClick={() => router.push(`${basePath}/${row.id}`)}
            />
          </Tooltip>
          <Tooltip content="Excluir">
            <ActionButton
              icon={AiOutlineDelete as React.ForwardRefExoticComponent<React.ComponentProps<'svg'>>}
              color="danger"
              onClick={() => onDelete?.(row.id)}
            />
          </Tooltip>
          {customActions?.(row)}
        </div>
      ),
    }
  ];

  const totalPercent = columns.reduce((acc, col) => acc + col.widthPercent, 0);

  return (
    <div className="w-full flex justify-center">
      <div
        style={{
          width: `${totalPercent}%`,
          maxWidth: "100%",
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl">
          {/* Header section */}
          <div className="p-6 pb-3">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <Title size="md" align="left" className="ps-3">
                {title}
              </Title>
              <div className="flex items-center gap-2">
                {onFilter && (
                  <Button
                    variant="light"
                    outline
                    onClick={onFilter}
                    buttonType="compact"
                  >
                    <FaFilter size={12} className="mr-1.5" /> Filtrar
                  </Button>
                )}
                {onNewClick && (
                  <Button 
                    variant="primary"
                    outline
                    onClick={onNewClick}
                    buttonType="compact"
                  >
                    <TiPlus className="mr-1.5" /> {buttonText}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Table section */}
          <div className="px-6 pb-3">
            <div className="border-b-2 border-gray-200">
              <table className="w-full">
                <colgroup>
                  {columns.map((col) => (
                    <col key={String(col.key)} style={{ width: `${col.widthPercent}%` }} />
                  ))}
                </colgroup>
                
                {/* Fixed header */}
                <thead className="bg-white border-b-2 border-gray-200">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        className="px-6 py-3"
                        style={{ width: `${col.widthPercent}%` }}
                      >
                        <Title size="xs" align={col.align || 'left'}>
                          {col.label}
                        </Title>
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>

            {/* Scrollable body - increased max height */}
            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
              <table className="w-full">
                <colgroup>
                  {columns.map((col) => (
                    <col key={String(col.key)} style={{ width: `${col.widthPercent}%` }} />
                  ))}
                </colgroup>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className="px-6 py-3 whitespace-nowrap"
                          style={{ width: `${col.widthPercent}%` }}
                        >
                          {col.render ? (
                            col.render(row[col.key], row)
                          ) : (
                            <Text size="sm" align={col.align || 'left'}>
                              {String(row[col.key])}
                            </Text>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={columns.length} className="pt-3">
                        <Alert icon={FaInfoCircle} variant="primary">
                          Nenhum registro encontrado.
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
