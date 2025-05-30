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
import { FilterModal, FilterField, FilterValues } from "@/components/FilterModal";
import { BiSortZA, BiSortAZ } from "react-icons/bi";

export type ListTableColumn<T> = {
  key: keyof T;
  label: string;
  widthPercent: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => ReactNode;
  sortable?: boolean;
};

export interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

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
  onFilter?: (filters: FilterValues) => void;
  deleteModalTitle?: string;
  deleteModalDescription?: string;
  deleteModalConfirmText?: string;
  deleteModalCancelText?: string;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMoreData?: boolean;
  filterFields?: FilterField[];
  initialFilterValues?: FilterValues;
  sortConfig?: SortConfig;
  onSort?: (sortConfig: SortConfig) => void;
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
  isLoading = false,
  isLoadingMore = false,
  hasMoreData = false,
  filterFields = [],
  initialFilterValues = {},
  sortConfig,
  onSort,
}: ListTableProps<T>) {
  const router = useRouter();

  // Estado para controlar o modal de confirmação de exclusão
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  
  // Estado para controlar o modal de filtro
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>(initialFilterValues);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Effect para contar filtros ativos
  useEffect(() => {
    const count = Object.values(filterValues).filter(value => 
      value !== null && value !== '' && value !== undefined
    ).length;
    setActiveFiltersCount(count);
  }, [filterValues]);

  // Effect para atualizar filtros quando valores iniciais mudam
  useEffect(() => {
    setFilterValues(initialFilterValues);
  }, [initialFilterValues]);

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

  // Funções para lidar com o filtro
  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = (values: FilterValues) => {
    setFilterValues(values);
    setShowFilterModal(false);
    if (onFilter) {
      onFilter(values);
    }
  };

  const handleClearFilter = () => {
    const emptyFilters = {} as FilterValues;
    setFilterValues(emptyFilters);
    setShowFilterModal(false);
    if (onFilter) {
      onFilter(emptyFilters);
    }
  };

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

  // Função para lidar com o clique do cabeçalho da coluna para ordenar
  const handleSort = (columnKey: keyof T, sortable: boolean | undefined) => {
    if (!onSort || !sortable) {
      return; // Não faz nada se a coluna não for ordenável ou não tiver callback de ordenação
    }
    
    let newSortOrder: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.sortBy === String(columnKey)) {
      // Alterna a direção da ordenação se já estiver ordenando por esta coluna
      newSortOrder = sortConfig.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    onSort({
      sortBy: String(columnKey),
      sortOrder: newSortOrder
    });
  };

  const columns = [
    ...userColumns,
    {
      key: 'actions' as keyof T,
      label: 'Ações',
      widthPercent: actionsColumnWidth,
      align: 'center' as const,
      sortable: false,
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
  const skeletonRowCount = 5; // Número de linhas de esqueleto a serem exibidas durante o carregamento

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
                  {filterFields.length > 0 && (
                    <Button
                      variant="light"
                      onClick={handleOpenFilterModal}
                      buttonType="compact"
                      className="relative"
                    >
                      <FiFilter className="mr-1.5" /> Filtrar
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
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
                {filterFields.length > 0 && (
                  <Button
                    variant="light"
                    onClick={handleOpenFilterModal}
                    buttonType="compact"
                    className="relative"
                  >
                    <FiFilter className="mr-1.5" /> Filtrar
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
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
                        className={`px-2 sm:px-6 py-2 sm:py-3 ${col.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                        onClick={() => handleSort(col.key, col.sortable)}
                      >
                        <div className={`flex items-center ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                          <Title size="xs" align={col.align || 'left'}>
                            {col.label}
                          </Title>
                          
                          {/* Indicador de ordenação com novos ícones */}
                          {col.sortable && sortConfig && sortConfig.sortBy === String(col.key) && (
                            <span className="ml-1 text-gray-600">
                              {sortConfig.sortOrder === 'asc' ? 
                                <BiSortAZ className="w-5 h-5" /> : 
                                <BiSortZA className="w-5 h-5" />}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading && data.length === 0 && !isLoadingMore ? (
                    // Skeleton Loading State
                    Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                      <tr key={`skeleton-${rowIndex}`} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        {columns.map((col) => (
                          <td
                            key={`skeleton-${rowIndex}-${String(col.key)}`}
                            className="px-2 sm:px-6 py-3 whitespace-normal break-words"
                          >
                            <div className={`h-4 bg-gray-200 rounded animate-pulse ${col.align === 'center' ? 'mx-auto w-1/2' : col.align === 'right' ? 'ml-auto w-3/4' : 'w-3/4'}`}></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <>
                      {data.map((row, index) => (
                        <tr 
                          key={row.id} 
                          className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${isLoading && !isLoadingMore ? 'opacity-60' : ''}`}
                        >
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
                      
                      {/* Mostrar "Nenhum registro" somente se não estiver carregando e os dados estiverem realmente vazios */}
                      {!isLoading && data.length === 0 && !isLoadingMore && (
                        <tr>
                          <td colSpan={columns.length} className="pt-3">
                            <Alert icon={FaInfoCircle} variant="primary">
                              Nenhum registro encontrado.
                            </Alert>
                          </td>
                        </tr>
                      )}
                      
                      {/* Spinner para carregar mais itens (paginação) */}
                      {isLoadingMore && (
                        <tr>
                          <td colSpan={columns.length} className="py-3 text-center">
                            <div className="flex justify-center items-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
      
      {/* Modal de filtro */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
        fields={filterFields}
        currentValues={filterValues}
      />
    </div>
  );
}
