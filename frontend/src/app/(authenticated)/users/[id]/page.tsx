"use client";

import { usersService, UserWithIndex } from "@/services/users";
import { validateUserForm } from "@/validators/userValidator";
import { usePageTitle } from "@/hooks/usePageTitle";
import EntityFormPage from "@/components/EntityFormPage";
import { useParams } from "next/navigation";

export default function UserFormPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  usePageTitle("Cadastro - Usuário");

  return (
    <EntityFormPage<UserWithIndex>
      service={usersService}
      validateForm={validateUserForm}
      groups={[
        [
          { name: "name", label: "Nome", type: "text", col: 2, value: "", required: true },
          { name: "document", label: "Documento", type: "text", col: 1, value: "", required: true },
        ],
        [
          { name: "email", label: "Email", type: "email", col: 1, value: "", required: false },
          {
            name: "password",
            label: isNew ? "Senha" : "Nova senha",
            type: "password",
            col: 1,
            value: "",
            required: isNew
          },
          {
            name: "password_confirmation",
            label: isNew ? "Confirmar Senha" : "Confirmar nova senha",
            type: "password",
            col: 1,
            value: "",
            required: isNew
          }
        ],
      ]}
      returnPath="/users"
      titleNew="Cadastro • Usuário"
      titleEdit="Edição • Usuário"
      formatters={{
        name: "uppercase",
        email: "lowercase",
        document: "cpf"
      }}
    />
  );
}
