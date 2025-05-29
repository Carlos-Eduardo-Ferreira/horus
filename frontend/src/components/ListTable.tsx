import React, { ReactNode, useState, useRef, useEffect, useCallback } from "react";
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
import { ConfirmModal } from "@/components/ConfirmModal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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
  onDelete?: (id: number) => Promise<void> | void;
  actionsColumnWidth?: number;
  onFilter?: () => void;
  deleteModalTitle?: string;
  deleteModalDescription?: string;
  deleteModalConfirmText?: string;
  deleteModalCancelText?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMoreData?: boolean;
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
  deleteModalTitle = "Deseja realmente excluir?",
  deleteModalDescription = "Esta ação não poderá ser desfeita.",
  deleteModalConfirmText = "Excluir",
  deleteModalCancelText = "Cancelar",
  onLoadMore,
  isLoadingMore = false,
  hasMoreData = false,
}: ListTableProps<T>) {
  const router = useRouter();

  // Estado para controlar o modal de confirmação de exclusão
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);

  useEffect(() => {
    const checkScrollbar = () => {
      const el = tableContainerRef.current;
      if (el) {
        // Considera scrollbar se scrollHeight > clientHeight (vertical)
        setHasVerticalScrollbar(el.scrollHeight > el.clientHeight);
      }
    };
    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);
    return () => window.removeEventListener("resize", checkScrollbar);
  }, [data]);

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId == null || !onDelete) return;
    setConfirmLoading(true);
    await onDelete(deleteId);
    setConfirmLoading(false);
    setDeleteId(null);
  };

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
              onClick={() => handleDelete(row.id)}
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

  // Função para manipular eventos de rolagem
  const handleScroll = useCallback(() => {
    const el = tableContainerRef.current;
    if (!el || !onLoadMore || isLoadingMore || !hasMoreData) return;
    
    // Se o usuário rolar até 200px da parte inferior, carregue mais dados
    const scrollPosition = el.scrollTop + el.clientHeight;
    const scrollThreshold = el.scrollHeight - 200;
    
    if (scrollPosition >= scrollThreshold) {
      onLoadMore();
    }
  }, [onLoadMore, isLoadingMore, hasMoreData]);

  // Adicionar ouvinte de evento de rolagem
  useEffect(() => {
    const el = tableContainerRef.current;
    if (el && onLoadMore) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, onLoadMore]);

  return (
    <div className="w-full flex justify-center">
      <div
        className="freeze-width mx-auto w-full"
        style={
          { '--pct': `${totalPercent/100}`,
            '--freeze': `${FREEZE_PX}px` } as React.CSSProperties
        }
      >
        <div className={
          `bg-white rounded-xl shadow-lg` +
          (!hasVerticalScrollbar ? " pb-6 pr-3" : "")
        }>
          {/* Header section */}
          <div className="p-4 sm:p-6 pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-1 flex-shrink-0 gap-2">
              <Title size="md" align="left" className="ps-1 sm:ps-3 color-primary">
                {title}
              </Title>
              {/* Versão mobile dos botões - visível apenas em telas pequenas */}
              <div className="sm:hidden w-full">
                <div className="form-buttons">
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
              {/* Versão desktop dos botões - só visível em telas médias e maiores */}
              <div className="hidden sm:flex items-center gap-2">
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
            <div
              ref={tableContainerRef}
              className="overflow-auto max-h-[calc(100dvh-20rem)] md:max-h-[calc(100dvh-17rem)]"
            >
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
                  {isLoadingMore && (
                    <tr>
                      <td colSpan={columns.length} className="py-3 text-center">
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        show={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onOk={handleConfirmDelete}
        confirmLoading={confirmLoading}
        title={deleteModalTitle}
        description={deleteModalDescription}
        confirmText={deleteModalConfirmText}
        cancelText={deleteModalCancelText}
        icon={<ExclamationTriangleIcon className="w-20 h-20 text-red-500" />}
      />
    </div>
  );
}
