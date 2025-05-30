"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListTable, ListTableColumn, SortConfig } from "@/components/ListTable";
import { actionsService, Action, FilterParams } from "@/services/actions";
import { FilterField, FilterValues } from "@/components/FilterModal";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ActionsPage() {
  // Define o título da página
  usePageTitle('Ações de Usuário');
  
  const [actions, setActions] = useState<Action[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const router = useRouter();

  // Define as colunas da tabela com possibilidade de ordenação
  const columns: ListTableColumn<Action>[] = [
    { key: "name", label: "Nome", widthPercent: 23, align: 'left', sortable: true },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: 'center', sortable: true },
  ];

  // Define os campos disponíveis no filtro e seus formatadores
  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "identifier", label: "Identificador", type: "text", formatter: "identifier" },
  ];

  /* Busca a lista de ações a partir do backend.
    Pode ser chamada tanto para carregamento inicial quanto para paginação ou filtros. */
  const fetchActions = async (page: number = 1, filters: FilterParams = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (!isLoading) setIsLoading(true);

    try {
      const response = await actionsService.list(token, page, filters, sortConfig);

      if (page === 1) {
        // Substitui os dados ao carregar a primeira página
        setActions(response.data);
      } else {
        // Acrescenta os novos dados à lista atual, evitando duplicatas
        setActions(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewData = response.data.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewData];
        });
      }

      setCurrentPage(response.meta.current_page);
      setLastPage(response.meta.last_page);
    } catch (error) {
      console.error("Erro ao buscar ações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os dados iniciais e reexecuta quando filtros ou ordenação mudarem
  useEffect(() => {
    fetchActions(1, filterValues);
  }, [filterValues, sortConfig]);

  // Realiza a paginação quando o usuário solicita mais dados
  const handleLoadMore = () => {
    if (isLoading || currentPage >= lastPage) return;
    fetchActions(currentPage + 1, filterValues);
  };

  // Aplica novos filtros e reinicia a listagem
  const handleFilter = (filters: FilterValues) => {
    setFilterValues(filters);
    setActions([]);
    setCurrentPage(1);
  };

  // Aplica nova ordenação e reinicia a listagem
  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
    setActions([]);
    setCurrentPage(1);
  };

  // Exclui uma action e atualiza a lista
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await actionsService.remove(id, token);
    setActions(actions => actions.filter(a => a.id !== id));
  };

  return (
    <ListTable
      title="Ações de usuário"
      columns={columns}
      data={actions}
      basePath="/actions"
      actionsColumnWidth={10}
      isLoading={isLoading}
      isLoadingMore={isLoading && currentPage > 1 && actions.length > 0}
      hasMoreData={currentPage < lastPage}
      filterFields={filterFields}
      initialFilterValues={filterValues}
      sortConfig={sortConfig}
      onNewClick={() => router.push("/actions/new")}
      onDelete={handleDelete}
      onFilter={handleFilter}
      onLoadMore={handleLoadMore}
      onSort={handleSort}
    />
  );
}
