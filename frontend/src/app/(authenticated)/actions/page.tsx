"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListTable, ListTableColumn } from "@/components/ListTable";

type Action = {
  id: number;
  name: string;
  identifier: string;
};

const initialActions: Action[] = [
  { id: 1, name: "ACESSAR", identifier: "access" },
  { id: 2, name: "CADASTRAR", identifier: "register" },
  { id: 3, name: "MODIFICAR", identifier: "modify" },
  { id: 4, name: "REMOVER", identifier: "remove" },
  { id: 5, name: "CONSULTAR", identifier: "consult" },
  { id: 6, name: "INSERIR", identifier: "insert" },
  { id: 7, name: "ATUALIZAR", identifier: "update" },
  { id: 8, name: "APAGAR", identifier: "erase" },
  { id: 9, name: "EXPORTAR", identifier: "export" },
  { id: 10, name: "IMPORTAR", identifier: "import" },
  { id: 11, name: "VALIDAR", identifier: "validate" },
  { id: 12, name: "REJEITAR", identifier: "reject" },
  { id: 13, name: "ARQUIVAR", identifier: "archive" },
  { id: 14, name: "DESBLOQUEAR", identifier: "unblock" },
  { id: 15, name: "BLOQUEAR", identifier: "block" },
  { id: 16, name: "RESTAURAR", identifier: "restore" }
];

export default function ActionsPage() {
  const [actions] = useState<Action[]>(initialActions);
  const router = useRouter();

  const columns: ListTableColumn<Action>[] = [
    { key: "name", label: "Nome", widthPercent: 25, align: 'left' },
    { key: "identifier", label: "Identificador", widthPercent: 20, align: 'center' },
  ];

  return (
    <ListTable
      columns={columns}
      data={actions}
      title="Ações de usuário"
      basePath="/actions"
      actionsColumnWidth={10}
      onNewClick={() => router.push("/actions/new")}
      onDelete={(id) => console.log('Delete action:', id)}
      onFilter={() => console.log('Filter clicked')}
    />
  );
}
