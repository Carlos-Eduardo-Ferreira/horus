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
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "@/components/Tooltip";
import { FiFilter } from "react-icons/fi";

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

  const REF_DESKTOP = 1920;
  const totalPercent = columns.reduce((s, c) => s + c.widthPercent, 0);
  const FREEZE_PX = (totalPercent / 100) * REF_DESKTOP;

  return (
    <div className="w-full flex justify-center">
      <div
        className="table--freeze mx-auto w-full"
        style={
          { '--pct': `${totalPercent/100}`,
            '--freeze': `${FREEZE_PX}px` } as React.CSSProperties
        }
      >
        <div className="bg-white rounded-xl shadow-lg">
          {/* Header section */}
          <div className="p-4 sm:p-6 pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-1 flex-shrink-0 gap-2">
              <Title size="md" align="left" className="ps-1 sm:ps-3 color-primary">
                {title}
              </Title>
              <div className="flex items-center gap-2">
                {onFilter && (
                  <Button
                    variant="light"
                    onClick={onFilter}
                    buttonType="compact"
                  >
                    <FiFilter className="mr-1.5" /> Filtrar
                  </Button>
                )}
                {onNewClick && (
                  <Button 
                    variant="primary"
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
          <div className="px-3 sm:ps-6 sm:pe-3">
            <div className="overflow-auto max-h-[calc(100dvh-17rem)] md:max-h-[calc(100dvh-16rem)]">
              <table className="w-full min-w-[600px]">
                <colgroup>
                  {columns.map((col) => (
                    <col key={String(col.key)} style={{ width: `${col.widthPercent}%` }} />
                  ))}
                </colgroup>
                {/* Sticky header */}
                <thead className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        className="px-2 sm:px-6 py-2 sm:py-3"
                      >
                        <Title size="xs" align={col.align || 'left'}>
                          {col.label}
                        </Title>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={row.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className="px-2 sm:px-6 py-2 sm:py-3 whitespace-normal break-words"
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
                      <td colSpan={columns.length} className="py-3">
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
