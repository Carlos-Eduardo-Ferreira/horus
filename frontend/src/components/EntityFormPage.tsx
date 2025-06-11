"use client";

import { useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import DynamicForm, { DynamicFormField, SpecialFieldConfig } from "@/components/DynamicForm";
import axios from "axios";
import { formatField, FormatterType } from "@/utils/fieldFormatters";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useContentOverflow } from "@/hooks/useContentOverflow";
import { useLayout } from "@/app/(authenticated)/layout";
import { useNotificationToast } from '@/hooks/useNotificationToast';

type EntityData = Record<string, string | number | boolean | null | undefined>;

export interface AutoFillConfig {
  triggerField: string;
  triggerLength: number;
  service: (value: string) => Promise<Record<string, string> | null>;
  fieldMappings: { [serviceField: string]: string };
  loadingText?: string;
  errorColor?: string;
  loadingColor?: string;
  findOptionMapping?: (value: string, options: { value: string; label: string }[]) => { value: string; label: string } | undefined;
}

export interface EntityFormPageProps<T extends EntityData = EntityData> {
  service: {
    get(id: number | string, token: string): Promise<T>;
    create(payload: Partial<T>, token: string): Promise<T>;
    update(id: number | string, payload: Partial<T>, token: string): Promise<T>;
  };
  validateForm: (fields: DynamicFormField[]) => { [key: string]: string };
  fields?: DynamicFormField[];
  groups?: DynamicFormField[][];
  returnPath: string;
  titleNew: string;
  titleEdit: string;
  formatters?: { [key: string]: FormatterType };
  autoFillConfig?: AutoFillConfig;
  transformPayload?: (fields: DynamicFormField[]) => Partial<T>;
  submitting?: boolean;
}

export default function EntityFormPage<T extends EntityData = EntityData>({
  service,
  validateForm,
  fields: legacyFields,
  groups: initialGroups,
  returnPath,
  titleNew,
  titleEdit,
  formatters = {},
  autoFillConfig,
  transformPayload,
  submitting: submittingProp = false,
}: EntityFormPageProps<T>) {
  const params = useParams() as Record<string, string> | null;
  const id = params && typeof params === "object" && "id" in params ? String(params.id) : "";
  const isNew = id === "new";

  usePageTitle(isNew ? titleNew : titleEdit);

  const router = useRouter();
  const { setStickyFooter } = useLayout();
  const formRef = useRef<HTMLDivElement>(null);
  const isContentOverflowing = useContentOverflow(formRef);
  const { success, error: showError } = useNotificationToast();
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [groups, setGroups] = useState<DynamicFormField[][]>(
    initialGroups || (legacyFields ? [legacyFields] : [[]])
  );
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [specialFields, setSpecialFields] = useState<{ [fieldName: string]: SpecialFieldConfig }>({});
  
  // Ref para manter sempre o estado mais atual dos grupos
  const groupsRef = useRef(groups);
  groupsRef.current = groups;
  
  // Flag para controlar se os dados já foram carregados uma vez
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    setStickyFooter(!isContentOverflowing);
  }, [isContentOverflowing, setStickyFooter]);

  useEffect(() => {
    return () => {
      setStickyFooter(true);
    };
  }, [setStickyFooter]);

  useEffect(() => {
    // Só carrega os dados se ainda não foram carregados e não é um novo registro
    if (!isNew && id && !dataLoadedRef.current) {
      dataLoadedRef.current = true; // Marca como carregado ANTES da chamada
      
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      service.get(id, token)
        .then(data => {
          const updateGroupsWithData = (groupsToUpdate: DynamicFormField[][]): DynamicFormField[][] => {
            return groupsToUpdate.map(group =>
              group.map(field => {
                let fieldValue = String(data[field.name as keyof T] || "");

                if (formatters[field.name] && fieldValue) {
                  fieldValue = formatField(formatters[field.name], fieldValue);
                }

                return {
                  ...field,
                  value: fieldValue
                };
              })
            );
          };

          const dataGroups = initialGroups || (legacyFields ? [legacyFields] : [[]]);
          setGroups(updateGroupsWithData(dataGroups));
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao carregar dados:", error);
          setLoading(false);
          dataLoadedRef.current = false; // Permite tentar novamente em caso de erro
        });
    } else if (isNew) {
      // Para novos registros, inicializa os grupos vazios
      const initializedGroups = (initialGroups || (legacyFields ? [legacyFields] : [[]])).map(group =>
        group.map(field => ({
          ...field,
          value: field.value || ""
        }))
      );
      setGroups(initializedGroups);
    }
  }, [id, isNew, service, formatters, initialGroups, legacyFields]);

  const handleChange = (name: string, value: string | number) => {
    let formattedValue = value;

    // Aplica formatação em todos os campos, incluindo o trigger field
    if (formatters[name]) {
      formattedValue = formatField(formatters[name], value);
    }

    if (autoFillConfig && name === autoFillConfig.triggerField && specialFields[name]?.error) {
      setSpecialFields(prev => ({
        ...prev,
        [name]: { ...prev[name], error: null }
      }));
    }
    
    // Atualiza o estado e força sincronização imediata
    flushSync(() => {
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
    });

    if (autoFillConfig && name === autoFillConfig.triggerField) {
      const cleanValue = String(formattedValue).replace(/\D/g, '');
      if (cleanValue.length === autoFillConfig.triggerLength) {
        handleAutoFillWithCurrentState(cleanValue);
      }
    }

    if (hasSubmitted) {
      const updatedFields = groups.flat().map(f =>
        f.name === name ? { ...f, value: formattedValue } : f
      );
      const errors = validateForm(updatedFields);
      setFieldErrors(errors);
    }
  };

  const handleAutoFillWithCurrentState = async (value: string) => {
    if (!autoFillConfig || !value || value.replace(/\D/g, '').length !== autoFillConfig.triggerLength) {
      return;
    }

    const triggerField = autoFillConfig.triggerField;

    setSpecialFields(prev => ({
      ...prev,
      [triggerField]: {
        ...prev[triggerField],
        loading: true,
        error: null
      }
    }));

    try {
      const data = await autoFillConfig.service(value);

      if (data && Object.keys(data).length > 0) {
        // Atualiza usando o estado atual dos grupos
        setGroups(currentGroups => {
          const newGroups = currentGroups.map(row =>
            row.map(f => {
              const mappedField = autoFillConfig.fieldMappings[f.name];
              
              // Não atualiza o campo trigger durante auto-preenchimento
              if (f.name === autoFillConfig.triggerField) {
                return f;
              }
              
              if (mappedField && data[mappedField]) {
                let newValue = data[mappedField];

                if (formatters[f.name]) {
                  newValue = formatField(formatters[f.name], newValue);
                }

                if (f.type === 'select' && autoFillConfig.findOptionMapping && f.options) {
                  const option = autoFillConfig.findOptionMapping(data[mappedField], f.options);
                  return { ...f, value: option?.value || f.value };
                }

                return { ...f, value: newValue };
              }
              return f;
            })
          );
          
          return newGroups;
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setSpecialFields(prev => ({
          ...prev,
          [triggerField]: {
            ...prev[triggerField],
            loading: false,
            error: error.message
          }
        }));
      } else {
        setSpecialFields(prev => ({
          ...prev,
          [triggerField]: {
            ...prev[triggerField],
            loading: false,
            error: 'Erro ao consultar dados. Verifique se a informação está correta.'
          }
        }));
      }
    } finally {
      setSpecialFields(prev => ({
        ...prev,
        [triggerField]: {
          ...prev[triggerField],
          loading: false
        }
      }));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    // Verifica se algum campo especial está carregando (consultando API)
    const isAnyFieldLoading = Object.values(specialFields).some(field => field.loading);
    
    if (isAnyFieldLoading) {
      // Não permite submit enquanto algum campo está carregando
      return;
    }

    const allFields = groups.flat();
    const errors = validateForm(allFields);

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

    // Usa transformPayload se fornecido
    const payload: Partial<T> = transformPayload
      ? transformPayload(allFields)
      : (() => {
          const p: Partial<T> = {};
          allFields.forEach(field => {
            (p as Record<string, unknown>)[field.name] = String(field.value || "");
          });
          return p;
        })();

    try {
      if (isNew) {
        await service.create(payload, token);
        success('Registro criado com sucesso!');
      } else {
        await service.update(id, payload, token);
        success('Registro atualizado com sucesso!');
      }

      setSubmitting(false);
      router.push(returnPath);
    } catch (error: unknown) {
      setSubmitting(false);

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
        const firstError = Object.keys(backendErrors)[0];
        document.getElementById(firstError)?.focus();
        showError('Verifique os dados informados e tente novamente.');
      } else {
        showError('Erro ao salvar o registro. Tente novamente.');
      }
    }
  };

  const allFields = groups.flat();

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  const customTitle = isNew ? titleNew : titleEdit;

  // Verifica se algum campo especial está carregando
  const isAnyFieldLoading = Object.values(specialFields).some(field => field.loading);
  
  // Se o prop submitting for true, força o estado de submissão (bloqueia o botão)
  // Também bloqueia se algum campo especial estiver carregando
  const effectiveSubmitting = submittingProp || submitting || isAnyFieldLoading;

  return (
    <div ref={formRef}>
      <DynamicForm
        fields={allFields}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={effectiveSubmitting}
        isNew={isNew}
        recordId={id}
        groups={groups}
        returnPath={returnPath}
        fieldErrors={fieldErrors}
        hasSubmitted={hasSubmitted}
        specialFields={specialFields}
        customTitle={customTitle}
      />
    </div>
  );
}
