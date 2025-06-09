"use client";

import { usersService, UserWithIndex } from "@/services/users";
import { cnpjService } from "@/services/cnpjService";
import { validateUserForm } from "@/validators/userValidator";
import { usePageTitle } from "@/hooks/usePageTitle";
import EntityFormPage from "@/components/EntityFormPage";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function UserFormPage() {
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  usePageTitle("Cadastro - Usuário");

  const [userData, setUserData] = useState<UserWithIndex | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  // Ref para garantir que setAutoFillLoading não cause warning de dependência
  const autoFillLoadingRef = useRef(setAutoFillLoading);
  autoFillLoadingRef.current = setAutoFillLoading;

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      usersService.get(id, token).then(user => {
        setUserData(user);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, isNew]);

  const role: string = isNew ? "user" : (userData?.role ?? "user");
  const isCompany = role === "company";
  const documentLabel = isCompany ? "CNPJ" : "CPF";
  const documentFormatter = isCompany ? "cnpj" : "cpf";

  // Auto preenchimento do nome da empresa via CNPJ
  const autoFillConfig = isCompany
    ? {
        triggerField: "document",
        triggerLength: 14,
        service: async (cnpj: string) => {
          autoFillLoadingRef.current(true);
          try {
            const data = await cnpjService.fetchCompany(cnpj);
            if (!data) {
              return null;
            }
            
            // Verificar se os dados essenciais existem e não são undefined
            if (!data.nome && !data.fantasia) {
              return null;
            }
            
            // name = fantasia, legal_name = razão social
            const result = { name: data.fantasia || data.nome, legal_name: data.nome };
            return result;
          } catch (error) {
            throw error;
          } finally {
            autoFillLoadingRef.current(false);
          }
        },
        fieldMappings: {
          name: "name",
          legal_name: "legal_name"
        },
        loadingText: "Buscando empresa...",
      }
    : undefined;

  if (!isNew && loading) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <EntityFormPage<UserWithIndex>
      service={usersService}
      validateForm={fields => validateUserForm(fields, role)}
      groups={
        isCompany
          ? [
              [
                {
                  name: "name",
                  label: "Nome Fantasia",
                  type: "text",
                  col: 2,
                  value: String(userData?.name ?? ""),
                  required: true,
                  disabled: true,
                },
                {
                  name: "legal_name",
                  label: "Razão Social",
                  type: "text",
                  col: 2,
                  value: userData?.legal_name != null ? String(userData.legal_name) : "",
                  required: false,
                  disabled: true,
                },
              ],
              [
                {
                  name: "document",
                  label: documentLabel,
                  type: "text",
                  col: 1,
                  value: String(userData?.document ?? ""),
                  required: true,
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  col: 1,
                  value: String(userData?.email ?? ""),
                  required: false,
                },
                {
                  name: "password",
                  label: isNew ? "Senha" : "Nova senha",
                  type: "password",
                  col: 1,
                  value: "",
                  required: isNew,
                },
                {
                  name: "password_confirmation",
                  label: isNew ? "Confirmar Senha" : "Confirmar nova senha",
                  type: "password",
                  col: 1,
                  value: "",
                  required: isNew,
                },
              ],
            ]
          : [
              [
                {
                  name: "name",
                  label: "Nome",
                  type: "text",
                  col: 2,
                  value: String(userData?.name ?? ""),
                  required: true,
                },
                {
                  name: "document",
                  label: documentLabel,
                  type: "text",
                  col: 1,
                  value: String(userData?.document ?? ""),
                  required: true,
                },
              ],
              [
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  col: 1,
                  value: String(userData?.email ?? ""),
                  required: false,
                },
                {
                  name: "password",
                  label: isNew ? "Senha" : "Nova senha",
                  type: "password",
                  col: 1,
                  value: "",
                  required: isNew,
                },
                {
                  name: "password_confirmation",
                  label: isNew ? "Confirmar Senha" : "Confirmar nova senha",
                  type: "password",
                  col: 1,
                  value: "",
                  required: isNew,
                },
              ],
            ]
      }
      returnPath="/users"
      titleNew="Cadastro • Usuário"
      titleEdit="Edição • Usuário"
      formatters={{
        name: "uppercase",
        legal_name: "uppercase",
        email: "lowercase",
        document: documentFormatter
      }}
      transformPayload={fields => {
        const payload: Record<string, string | null> = {};
        fields.forEach(f => {
          if ((f.name === "name" || f.name === "legal_name") && String(f.value).trim() === "") {
            payload[f.name] = null;
          } else {
            payload[f.name] = f.value === "" ? null : String(f.value);
          }
        });
        if (isNew) {
          payload.type = "user";
        }
        return payload;
      }}
      autoFillConfig={autoFillConfig}
      submitting={autoFillLoading}
    />
  );
}
