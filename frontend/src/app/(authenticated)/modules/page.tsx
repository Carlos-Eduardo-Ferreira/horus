"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ListTable, ListTableColumn, SortConfig } from "@/components/ListTable";
import { modulesService, Module, FilterParams } from "@/services/modules";
import { FilterField, FilterValues } from "@/components/FilterModal";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ModulesPage() {
  // Define o título da página
  usePageTitle("Módulos");

  const [modules, setModules] = useState<Module[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: "name",
    sortOrder: "asc",
  });

  const router = useRouter();

  // Define as colunas da tabela com possibilidade de ordenação
  const columns: ListTableColumn<Module>[] = [
    { key: "name", label: "Nome", widthPercent: 23, align: "left", sortable: true },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: "center", sortable: true },
  ];

  // Define os campos disponíveis no filtro e seus formatadores
  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "identifier", label: "Identificador", type: "text", formatter: "identifier" },
  ];

  /* 
    Busca a lista de módulos a partir do backend.
    Pode ser chamada tanto para carregamento inicial quanto para paginação ou filtros.
  */
  const fetchModules = useCallback(
    async (page: number = 1, filters: FilterParams = {}) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Marca como carregando
      setIsLoading(true);

      try {
        const response = await modulesService.list(token, page, filters, sortConfig);

        if (page === 1) {
          // Substitui os dados ao carregar a primeira página
          setModules(response.data);
        } else {
          // Acrescenta os novos dados à lista atual, evitando duplicatas
          setModules((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewData = response.data.filter((item) => !existingIds.has(item.id));
            return [...prev, ...uniqueNewData];
          });
        }

        setCurrentPage(response.meta.current_page);
        setLastPage(response.meta.last_page);
      } catch (error) {
        console.error("Erro ao buscar módulos:", error);
      } finally {
        // Finaliza o carregamento
        setIsLoading(false);
      }
    },
    [sortConfig] // Apenas sortConfig precisa ser monitorado como dependência
  );

  // Carrega os dados iniciais e reexecuta quando filtros ou ordenação mudarem
  useEffect(() => {
    fetchModules(1, filterValues);
  }, [fetchModules, filterValues]);

  // Realiza a paginação quando o usuário solicita mais dados
  const handleLoadMore = () => {
    if (isLoading || currentPage >= lastPage) return;
    fetchModules(currentPage + 1, filterValues);
  };

  // Aplica novos filtros e reinicia a listagem
  const handleFilter = (filters: FilterValues) => {
    setFilterValues(filters);
    setModules([]);
    setCurrentPage(1);
  };

  // Aplica nova ordenação e reinicia a listagem
  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
    setModules([]);
    setCurrentPage(1);
  };

  // Exclui um module e atualiza a lista
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await modulesService.remove(id, token);
    setModules((modules) => modules.filter((a) => a.id !== id));
  };

  // Renderiza a tabela com todos os controles
  return (
    <ListTable
      title="Módulos"
      columns={columns}
      data={modules}
      basePath="/modules"
      actionsColumnWidth={10}
      isLoading={isLoading}
      isLoadingMore={isLoading && currentPage > 1 && modules.length > 0}
      hasMoreData={currentPage < lastPage}
      filterFields={filterFields}
      initialFilterValues={filterValues}
      sortConfig={sortConfig}
      onNewClick={() => router.push("/modules/new")}
      onDelete={handleDelete}
      onFilter={handleFilter}
      onLoadMore={handleLoadMore}
      onSort={handleSort}
    />
  );
}
