"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListTable, ListTableColumn } from "@/components/ListTable";
import { actionsService, Action, FilterParams } from "@/services/actions";
import { FilterField, FilterValues } from "@/components/FilterModal";

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const router = useRouter();

  // Define as colunas da tabela
  const columns: ListTableColumn<Action>[] = [
    { key: "name", label: "Nome", widthPercent: 23, align: 'left' },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: 'center' },
  ];

  // Define os campos de filtro com seus respectivos formatadores
  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "identifier", label: "Identificador", type: "text", formatter: "identifier" },
  ];

  // Carrega as ações do usuário
  const fetchActions = async (page: number = 1, filters: FilterParams = {}) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await actionsService.list(token, page, filters);
      
      if (page === 1) {
        setActions(response.data);
      } else {
        // Adicionar novos dados aos dados existentes
        setActions(prev => [...prev, ...response.data]);
      }
      
      setCurrentPage(response.meta.current_page);
      setLastPage(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os dados iniciais
  useEffect(() => {
    fetchActions(1, filterValues);
  }, [filterValues]);

  // Lidar com o carregamento de mais dados durante a rolagem
  const handleLoadMore = () => {
    if (isLoading || currentPage >= lastPage) return;
    fetchActions(currentPage + 1, filterValues);
  };

  // Lidar com a aplicação de filtros
  const handleFilter = (filters: FilterValues) => {
    setFilterValues(filters);
    // Reiniciar para a primeira página ao filtrar
    fetchActions(1, filters);
  };

  // Callback de exclusão para passar ao ListTable
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await actionsService.remove(id, token);
    setActions(actions => actions.filter(a => a.id !== id));
  };

  return (
    <ListTable
      columns={columns}
      data={actions}
      title="Ações de usuário"
      basePath="/actions"
      actionsColumnWidth={10}
      onNewClick={() => router.push("/actions/new")}
      onDelete={handleDelete}
      onFilter={handleFilter}
      onLoadMore={handleLoadMore}
      isLoadingMore={isLoading && currentPage > 1}
      hasMoreData={currentPage < lastPage}
      filterFields={filterFields}
      initialFilterValues={filterValues}
    />
  );
}
