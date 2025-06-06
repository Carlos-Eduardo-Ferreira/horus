import React, { useEffect, useState } from "react";
import LabeledInput from "./LabeledInput";
import LabeledSelect from "./LabeledSelect";
import Button from "./Button";
import Title from "./Title";
import { FaSave } from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/classNames";

function getResponsiveMaxColsPerRow(width: number): number {
  if (width >= 1900) return 6;
  if (width >= 1400) return 4;
  if (width >= 1000) return 2;
  return 1;
}

type FieldType = "text" | "number" | "password" | "email" | "select";

export interface DynamicFormField {
  name: string;
  label: string;
  type: FieldType;
  col: number;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
}

export interface SpecialFieldConfig {
  loading?: boolean;
  error?: string | null;
  loadingText?: string;
  errorColor?: string;
  loadingColor?: string;
}

export interface DynamicFormProps {
  fields: DynamicFormField[];
  onChange: (name: string, value: string | number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  isNew: boolean;
  recordId?: string | number;
  groups?: DynamicFormField[][];
  returnPath?: string;
  fieldErrors?: { [key: string]: string };
  hasSubmitted?: boolean;
  specialFields?: { [fieldName: string]: SpecialFieldConfig };
  customTitle?: string;
}

function groupFieldsIntoRowsByLimit(fields: DynamicFormField[], maxColsLimit: number): DynamicFormField[][] {
  const rows: DynamicFormField[][] = [];
  let currentRow: DynamicFormField[] = [];
  let currentSum = 0;

  for (const field of fields) {
    if (field.col > maxColsLimit) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      rows.push([field]);
      currentRow = [];
      currentSum = 0;
    } else if (currentSum + field.col > maxColsLimit) {
      rows.push(currentRow);
      currentRow = [field];
      currentSum = field.col;
    } else {
      currentRow.push(field);
      currentSum += field.col;
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  return rows;
}

function groupStructuredGroupsByLimit(structuredGroups: DynamicFormField[][], maxColsLimit: number): DynamicFormField[][] {
  const allRenderableRows: DynamicFormField[][] = [];
  for (const onePredefinedGroup of structuredGroups) {
    const rowsFromThisGroup = groupFieldsIntoRowsByLimit(onePredefinedGroup, maxColsLimit);
    allRenderableRows.push(...rowsFromThisGroup);
  }
  return allRenderableRows;
}

export default function DynamicForm({
  fields,
  onChange,
  onSubmit,
  submitting,
  isNew,
  recordId,
  groups: initialGroupsProp,
  returnPath,
  fieldErrors = {},
  hasSubmitted = false,
  specialFields = {},
  customTitle,
}: DynamicFormProps) {
  const router = useRouter();
  const [currentMaxColsPerRow, setCurrentMaxColsPerRow] = useState(
    typeof window !== "undefined" ? getResponsiveMaxColsPerRow(window.innerWidth) : 6
  );

  useEffect(() => {
    const calculateMaxCols = () => {
      setCurrentMaxColsPerRow(getResponsiveMaxColsPerRow(window.innerWidth));
    };
    calculateMaxCols();
    window.addEventListener("resize", calculateMaxCols);
    return () => window.removeEventListener("resize", calculateMaxCols);
  }, []);

  let dataMaxCols: number;
  if (initialGroupsProp && initialGroupsProp.length > 0 && initialGroupsProp.some(g => g.length > 0)) {
    const tempRowsForSizing = groupStructuredGroupsByLimit(initialGroupsProp, 6);
    dataMaxCols = Math.max(1, ...tempRowsForSizing.map(row => row.reduce((sum, f) => sum + f.col, 0)));
  } else {
    const tempRowsForSizing = groupFieldsIntoRowsByLimit(fields, 6);
    dataMaxCols = Math.max(1, ...tempRowsForSizing.map(row => row.reduce((sum, f) => sum + f.col, 0)));
  }
  
  const totalPercentForCardStyle = (dataMaxCols / 6) * 100;
  
  const VIEWPORT_REFERENCE_WIDTH_PX = 1920;
  const SIDEBAR_WIDTH_OPEN_PX = 240; 
  const MAIN_CONTENT_HORIZONTAL_PADDING_PX = 48; 

  const REFERENCE_CONTENT_WIDTH = VIEWPORT_REFERENCE_WIDTH_PX - SIDEBAR_WIDTH_OPEN_PX - MAIN_CONTENT_HORIZONTAL_PADDING_PX;
  const freezePx = (totalPercentForCardStyle / 100) * REFERENCE_CONTENT_WIDTH;

  const finalRowsToRender: DynamicFormField[][] = 
    initialGroupsProp && initialGroupsProp.length > 0 && initialGroupsProp.some(g => g.length > 0)
    ? groupStructuredGroupsByLimit(initialGroupsProp, currentMaxColsPerRow)
    : groupFieldsIntoRowsByLimit(fields, currentMaxColsPerRow);
  
  const handleCancel = () => {
    if (returnPath) {
      router.push(returnPath);
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div
      className={`mx-auto freeze-width w-full`}
      style={
        {
          '--pct': `${totalPercentForCardStyle / 100}`,
          '--freeze': `${freezePx}px`
        } as React.CSSProperties
      }
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form noValidate
          className="w-full"
          onSubmit={e => { e.preventDefault(); onSubmit(); }}
          autoComplete="off"
        >
          <div className="flex items-center justify-between mb-6 ps-2">
            <Title size="md" align="left" className="color-primary">
              {customTitle || (isNew
                ? "Inserindo novo registro"
                : `Editando registro de nº ${recordId ?? ""}`)}
            </Title>
          </div>

          <div className="flex flex-col gap-y-6">
            {finalRowsToRender.map((row, rowIdx) => {
              const sumOfColsInThisRow = row.reduce((sum, f) => sum + f.col, 0);
              return (
                <div className="form-fields-row" key={rowIdx}>
                  {row.map((field) => {
                    const widthPct = sumOfColsInThisRow > 0 ? (field.col / sumOfColsInThisRow) * 100 : 100;
                    const specialConfig = specialFields[field.name];

                    return (
                      <div
                        key={field.name}
                        className="form-field-container"
                        style={{
                          width: `${widthPct}%`,
                          maxWidth: `${widthPct}%`
                        }}
                      >
                        {field.type === "select" ? (
                          <LabeledSelect
                            title={field.label}
                            options={field.options || []}
                            value={String(field.value || "")}
                            onChange={(value) => onChange(field.name, value)}
                            placeholder={field.placeholder}
                            disabled={field.disabled || submitting}
                            error={hasSubmitted && fieldErrors[field.name] ? fieldErrors[field.name] : undefined}
                          />
                        ) : (
                          <>
                            <LabeledInput
                              title={field.label}
                              type={field.type}
                              value={field.value}
                              onChange={e => onChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              required={field.required}
                              disabled={field.disabled || submitting || (specialConfig?.loading)}
                              error={field.error}
                              name={field.name}
                              className={cn(
                                'w-full px-3 py-2 border rounded',
                                hasSubmitted && fieldErrors[field.name]
                                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  : "border-gray-300 focus:border-gray-600 focus:ring-1 focus:ring-gray-600",
                                submitting && "bg-gray-100",
                                specialConfig?.loading && "bg-blue-50",
                                specialConfig?.error && "border-orange-500"
                              )}
                            />
                            {specialConfig?.loading && (
                              <div className={`flex items-center text-xs mt-1 ml-1 ${specialConfig.loadingColor || 'text-blue-600'}`}>
                                <div className={`animate-spin rounded-full h-3 w-3 border-b mr-1 ${specialConfig.loadingColor || 'border-blue-600'}`}></div>
                                {specialConfig.loadingText || 'Carregando...'}
                              </div>
                            )}
                            {specialConfig?.error && (
                              <div className={`text-xs mt-1 ml-1 ${specialConfig.errorColor || 'text-orange-600'}`}>
                                {specialConfig.error}
                              </div>
                            )}
                            {hasSubmitted && fieldErrors[field.name] && (
                              <div className="text-red-500 text-xs mt-1">
                                {fieldErrors[field.name]}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="form-buttons">
            <Button
              variant="light"
              type="button"
              buttonType="compact"
              onClick={handleCancel}
            >
              <TbArrowBackUp className="mr-1.5" /> Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              buttonType="compact"
              disabled={submitting}
            >
              <FaSave className="mr-1.5" /> Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
