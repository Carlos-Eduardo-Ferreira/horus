"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicForm, { DynamicFormField } from "@/components/DynamicForm";
import { actionsService } from "@/services/actions";
import { validateActionForm } from "@/validators/actionValidator";
import axios from "axios";
import { formatField } from "@/utils/fieldFormatters";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function ActionFormPage() {
  const params = useParams() as Record<string, string> | null;
  const id = params && typeof params === "object" && "id" in params ? String(params.id) : "";
  const isNew = id === "new";
  
  // Define o título da página de acordo com a ação (nova ou edição)
  usePageTitle(isNew ? 'Nova Ação de Usuário' : 'Editar Ação de Usuário');
  
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  // Define os grupos de campos do formulário
  const [groups, setGroups] = useState<DynamicFormField[][]>([
    [
      { name: "name", label: "Nome", type: "text", col: 2, value: "" },
      { name: "identifier", label: "Identificador", type: "text", col: 1, value: "" }
    ]
  ]);

  // Carrega os dados se não for novo
  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      actionsService.get(id, token).then(data => {
        setGroups([
          [
            { name: "name", label: "Nome", type: "text", col: 2, value: data.name },
            { name: "identifier", label: "Identificador", type: "text", col: 1, value: data.identifier }
          ]
        ]);
        setLoading(false);
      });
    }
  }, [id, isNew]);

  // Estados para erros de campo e controle de envio
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Modifica o valor conforme as regras usando os formatadores básicos
  const handleChange = (name: string, value: string | number) => {
    // Aplica formatações específicas de acordo com o campo
    let formattedValue = value;
    
    if (name === "name") {
      formattedValue = formatField('uppercase', value);
    } else if (name === "identifier") {
      formattedValue = formatField('identifier', value);
    }
    
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
    
    // Se já tentou enviar, revalida o campo conforme digita
    if (hasSubmitted) {
      const allFields = groups.flat().map(f =>
        f.name === name ? { ...f, value: formattedValue } : f
      );
      setFieldErrors(validateActionForm(allFields));
    }
  };

  // Envia os dados do formulário
  const handleSubmit = async () => {
    setHasSubmitted(true);
    const allFields = groups.flat();
    const errors = validateActionForm(allFields);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      // Foca no primeiro campo com erro
      const firstError = Object.keys(errors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    const [fields] = groups;
    const payload = {
      name: String(fields[0].value),
      identifier: String(fields[1].value),
    };
    try {
      if (isNew) {
        await actionsService.create(payload, token);
      } else {
        await actionsService.update(id, payload, token);
      }
      setSubmitting(false);
      router.push("/actions");
    } catch (error: unknown) {
      setSubmitting(false);
      if (axios.isAxiosError(error) && error.response && error.response.status === 422 && error.response.data.errors) {
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
      returnPath="/actions"
      fieldErrors={fieldErrors}
      hasSubmitted={hasSubmitted}
    />
  );
}
