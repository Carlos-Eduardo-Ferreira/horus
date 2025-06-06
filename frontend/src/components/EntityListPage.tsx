"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ListTable, ListTableColumn, SortConfig } from "@/components/ListTable";
import { FilterField, FilterValues } from "@/components/FilterModal";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationToast } from '@/hooks/useNotificationToast';

export interface EntityListPageProps<T extends { id: number }> {
  title: string;
  service: {
    list(
      token: string,
      page?: number,
      filters?: { [key: string]: string | number | null },
      sort?: SortConfig
    ): Promise<{
      data: T[];
      meta: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      };
    }>;
    remove(id: number | string, token: string): Promise<void>;
  };
  columns: ListTableColumn<T>[];
  filterFields: FilterField[];
  basePath: string;
  defaultSort?: SortConfig;
  actionsColumnWidth?: number;
  canEdit?: (item: T) => boolean;
  canDelete?: (item: T) => boolean;
}

export default function EntityListPage<T extends { id: number }>({
  title,
  service,
  columns,
  filterFields,
  basePath,
  defaultSort = { sortBy: "name", sortOrder: "asc" },
  actionsColumnWidth = 10,
  canEdit,
  canDelete,
}: EntityListPageProps<T>) {
  // Define o título da aba da página dinamicamente
  usePageTitle(title);

  const [entities, setEntities] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort);

  const router = useRouter();
  const { success, error } = useNotificationToast();

  /**
   * Busca a lista de entidades a partir do backend, com suporte a paginação, filtros e ordenação.
   * Utiliza useCallback para garantir estabilidade da função entre renderizações.
   */
  const fetchEntities = useCallback(
    async (page: number = 1, filters: { [key: string]: string | number | null } = {}) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await service.list(token, page, filters, sortConfig);

        if (page === 1) {
          // Primeira página: substitui a lista atual
          setEntities(response.data);
        } else {
          // Páginas seguintes: adiciona itens novos, evitando duplicações por ID
          setEntities((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewData = response.data.filter((item) => !existingIds.has(item.id));
            return [...prev, ...uniqueNewData];
          });
        }

        setCurrentPage(response.meta.current_page);
        setLastPage(response.meta.last_page);
      } catch (error) {
        console.error(`Erro ao buscar ${title.toLowerCase()}:`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [service, sortConfig, title]
  );

  // Executa a busca inicial e refaz quando filtros ou ordenação mudarem
  useEffect(() => {
    fetchEntities(1, filterValues);
  }, [fetchEntities, filterValues]);

  // Requisita próxima página de dados ao rolar ou clicar em "Carregar mais"
  const handleLoadMore = () => {
    if (isLoading || currentPage >= lastPage) return;
    fetchEntities(currentPage + 1, filterValues);
  };

  // Aplica novos filtros e reinicia a listagem
  const handleFilter = (filters: FilterValues) => {
    setFilterValues(filters);
    setEntities([]);
    setCurrentPage(1);
  };

  // Aplica nova ordenação e reinicia a listagem
  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
    setEntities([]);
    setCurrentPage(1);
  };

  // Exclui uma entidade e remove da lista atual
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      await service.remove(id, token);
      setEntities((entities) => entities.filter((e) => e.id !== id));
      success('Registro excluído com sucesso!');
    } catch {
      error('Erro ao excluir o registro. Tente novamente.');
    }
  };

  // Renderiza a tabela reutilizável com filtros, ordenação e paginação
  return (
    <ListTable
      title={title}
      columns={columns}
      data={entities}
      basePath={basePath}
      actionsColumnWidth={actionsColumnWidth}
      isLoading={isLoading}
      isLoadingMore={isLoading && currentPage > 1 && entities.length > 0}
      hasMoreData={currentPage < lastPage}
      filterFields={filterFields}
      initialFilterValues={filterValues}
      sortConfig={sortConfig}
      onNewClick={() => router.push(`${basePath}/new`)}
      onDelete={handleDelete}
      onFilter={handleFilter}
      onLoadMore={handleLoadMore}
      onSort={handleSort}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}
