"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicForm, { DynamicFormField } from "@/components/DynamicForm";
import axios from "axios";
import { formatField, FormatterType } from "@/utils/fieldFormatters";
import { usePageTitle } from "@/hooks/usePageTitle";

export interface EntityFormPageProps {
  service: {
    get(id: number | string, token: string): Promise<{
      id: number;
      name: string;
      identifier: string;
    }>;
    create(payload: { name: string; identifier: string }, token: string): Promise<{
      id: number;
      name: string;
      identifier: string;
    }>;
    update(id: number | string, payload: { name: string; identifier: string }, token: string): Promise<{
      id: number;
      name: string;
      identifier: string;
    }>;
  };
  validateForm: (fields: DynamicFormField[]) => { [key: string]: string };
  fields?: DynamicFormField[]; 
  groups?: DynamicFormField[][];
  returnPath: string;
  titleNew: string;
  titleEdit: string;
  formatters?: { [key: string]: FormatterType };
}

export default function EntityFormPage({
  service,
  validateForm,
  fields: legacyFields,
  groups: initialGroups,
  returnPath,
  titleNew,
  titleEdit,
  formatters = {},
}: EntityFormPageProps) {
  const params = useParams() as Record<string, string> | null;
  const id = params && typeof params === "object" && "id" in params ? String(params.id) : "";
  const isNew = id === "new";
  
  // Define o título da aba com base na operação (criação ou edição)
  usePageTitle(isNew ? titleNew : titleEdit);
  
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [groups, setGroups] = useState<DynamicFormField[][]>(
    initialGroups || (legacyFields ? [legacyFields] : [[]])
  );
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Carrega os dados do registro se for edição
  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      
      service.get(id, token)
        .then(data => {
          const updateGroupsWithData = (groupsToUpdate: DynamicFormField[][]) => {
            return groupsToUpdate.map(group =>
              group.map(field => ({
                ...field,
                value: data[field.name as keyof typeof data] || ""
              }))
            );
          };

          const dataGroups = initialGroups || (legacyFields ? [legacyFields] : [[]]);
          setGroups(updateGroupsWithData(dataGroups));
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao carregar dados:", error);
          setLoading(false);
        });
    }
  }, [id, isNew, service, initialGroups, legacyFields]);

  // Aplica formatações ao campo (se definidas) e atualiza os dados no formulário
  const handleChange = (name: string, value: string | number) => {
    let formattedValue = value;

    // Aplica formatador específico, se houver
    if (formatters[name]) {
      formattedValue = formatField(formatters[name], value);
    }

    // Atualiza o valor no formulário
    setGroups(groups =>
      groups.map(row =>
        row.map(f => {
          if (f.name === name) {
            return { ...f, value: formattedValue };
          }
          return f;
        })
      )
    );

    // Se o formulário já foi submetido uma vez, revalida o campo atualizado
    if (hasSubmitted) {
      const allFields = groups.flat().map(f =>
        f.name === name ? { ...f, value: formattedValue } : f
      );
      setFieldErrors(validateForm(allFields));
    }
  };

  // Envia o formulário após validação
  const handleSubmit = async () => {
    setHasSubmitted(true);

    const allFields = groups.flat();
    const errors = validateForm(allFields);

    // Se houver erros, exibe-os e foca no primeiro campo inválido
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      const firstError = Object.keys(errors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    // Monta o payload com os campos relevantes
    const payload = {
      name: String(allFields.find(f => f.name === "name")?.value || ""),
      identifier: String(allFields.find(f => f.name === "identifier")?.value || "")
    };

    try {
      // Cria ou atualiza conforme o tipo de operação
      if (isNew) {
        await service.create(payload, token);
      } else {
        await service.update(id, payload, token);
      }

      setSubmitting(false);
      router.push(returnPath);
    } catch (error: unknown) {
      setSubmitting(false);

      // Trata erros de validação retornados pelo backend
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 422 &&
        error.response.data.errors
      ) {
        const backendErrors: { [key: string]: string } = {};
        const errorsObj = error.response.data.errors as Record<string, string[]>;
        for (const [field, messages] of Object.entries(errorsObj)) {
          backendErrors[field] = messages[0];
        }
        setFieldErrors(backendErrors);

        // Foca no primeiro campo com erro
        const firstError = Object.keys(backendErrors)[0];
        document.getElementById(firstError)?.focus();
      }
    }
  };

  const allFields = groups.flat();

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <DynamicForm
      fields={allFields}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitting={submitting}
      isNew={isNew}
      recordId={id}
      groups={groups}
      returnPath={returnPath}
      fieldErrors={fieldErrors}
      hasSubmitted={hasSubmitted}
    />
  );
}
