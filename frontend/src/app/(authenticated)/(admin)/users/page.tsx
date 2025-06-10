"use client";

import { ListTableColumn } from "@/components/ListTable";
import { usersService, User } from "@/services/users";
import { FilterField } from "@/components/FilterModal";
import EntityListPage from "@/components/EntityListPage";
import { formatForDisplay } from "@/utils/displayFormatters";
import Text from "@/components/Text";

export default function UsersPage() {
  const columns: ListTableColumn<User>[] = [
    { key: "name", label: "Nome", widthPercent: 25, align: "left", sortable: true },
    { key: "email", label: "Email", widthPercent: 15, align: "left", sortable: false },
    { 
      key: "document", 
      label: "Nº Documento", 
      widthPercent: 10, 
      align: "center", 
      sortable: false,
      render: (value) => (
        <Text size="sm" align="center" className="color-text">
          {formatForDisplay("cpfcnpj", value)}
        </Text>
      )
    },
    { key: "role", label: "Perfil", widthPercent: 10, align: "center", sortable: false },
  ];

  const filterFields: FilterField[] = [
    { name: "name", label: "Nome", type: "text", formatter: "uppercase" },
    { name: "document", label: "CPF/CNPJ", type: "text", formatter: "cpfcnpj" },
    { 
      name: "role", 
      label: "Perfil", 
      type: "select",
      options: [
        { value: "master", label: "Master" },
        { value: "admin", label: "Administrador" },
        { value: "user", label: "Usuário" },
        { value: "consumer", label: "Consumidor" },
        { value: "company", label: "Empresa" }
      ]
    }
  ];

  const canEdit = () => true;
  const canDelete = () => true;

  return (
    <EntityListPage
      title="Usuários"
      service={usersService}
      columns={columns}
      filterFields={filterFields}
      basePath="/users"
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}
