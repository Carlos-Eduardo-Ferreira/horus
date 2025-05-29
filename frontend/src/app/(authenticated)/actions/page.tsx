"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListTable, ListTableColumn } from "@/components/ListTable";
import { actionsService, Action } from "@/services/actions";

export default function ActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Define as colunas da tabela
  const columns: ListTableColumn<Action>[] = [
    { key: "name", label: "Nome", widthPercent: 23, align: 'left' },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: 'center' },
  ];

  // Carrega as ações do usuário
  const fetchActions = async (page: number = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await actionsService.list(token, page);
      
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
    fetchActions(1);
  }, []);

  // Lidar com o carregamento de mais dados durante a rolagem
  const handleLoadMore = () => {
    if (isLoading || currentPage >= lastPage) return;
    fetchActions(currentPage + 1);
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
      onFilter={() => console.log('Filter clicked')}
      onLoadMore={handleLoadMore}
      isLoadingMore={isLoading && currentPage > 1}
      hasMoreData={currentPage < lastPage}
    />
  );
}
