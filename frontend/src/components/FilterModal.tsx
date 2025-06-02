'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';
import Button from '@/components/Button';
import Title from '@/components/Title';
import LabeledInput from '@/components/LabeledInput';
import LabeledSelect from '@/components/LabeledSelect';
import { IoFilterOutline } from 'react-icons/io5';
import { formatField, FormatterType } from '@/utils/fieldFormatters';

export type FilterFieldType = 'text' | 'number' | 'select' | 'date';

export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  formatter?: FormatterType;
  options?: { label: string; value: string }[];
}

export interface FilterValues {
  [key: string]: string | number | null;
}

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  onApply: (values: FilterValues) => void;
  onClear: () => void;
  fields: FilterField[];
  currentValues: FilterValues;
  title?: string;
  applyText?: string;
  clearText?: string;
  cancelText?: string;
}

export function FilterModal({
  show,
  onClose,
  onApply,
  onClear,
  fields,
  currentValues,
  title = "Filtrar registros",
  applyText = "Aplicar filtros",
  clearText = "Limpar filtros",
  cancelText = "Cancelar",
}: FilterModalProps) {
  const [values, setValues] = useState<FilterValues>(currentValues || {});

  useEffect(() => {
    if (show) {
      setValues(currentValues || {});
    }
  }, [currentValues, show]);

  const handleChange = (name: string, value: string | number | null) => {
    const field = fields.find(f => f.name === name);
    let formattedValue = value;
    
    if (value !== null && field?.formatter) {
      formattedValue = formatField(field.formatter, value);
    }
    
    setValues(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleApply = () => {
    const filteredValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as FilterValues);
    
    onApply(filteredValues);
  };

  const handleClear = () => {
    setValues({});
    onClear();
  };

  return (
    <Transition
      appear
      show={show}
      as={Dialog}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      onClose={onClose}
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
      </TransitionChild>

      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95 translate-y-2"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="ease-in duration-300"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 translate-y-2"
        className={clsx(
          'scrollbar-sm relative w-full max-w-md flex flex-col overflow-y-auto rounded-lg bg-white px-4 py-6 duration-300 dark:bg-dark-700 sm:px-5'
        )}
      >
        <div className="flex items-center justify-center mb-5">
          <IoFilterOutline className="text-indigo-400 text-2xl mr-2" />
          <Title size="md" align="center">
            {title}
          </Title>
        </div>

        <div className="space-y-6 mb-6">
          {fields.map((field) => {
            switch (field.type) {
              case 'text':
                return (
                  <LabeledInput
                    key={field.name}
                    title={field.label}
                    value={values[field.name] as string || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                );
              case 'number':
                return (
                  <LabeledInput
                    key={field.name}
                    title={field.label}
                    type="number"
                    value={values[field.name] as string || ''}
                    onChange={(e) => handleChange(field.name, e.target.value ? Number(e.target.value) : null)}
                  />
                );
              case 'select':
                return (
                  <LabeledSelect
                    key={field.name}
                    title={field.label}
                    options={field.options || []}
                    value={String(values[field.name] || '')}
                    onChange={(value) => handleChange(field.name, value)}
                    placeholder="Selecione..."
                  />
                );
              case 'date':
                return (
                  <LabeledInput
                    key={field.name}
                    title={field.label}
                    type="date"
                    value={values[field.name] as string || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                );
              default:
                return null;
            }
          })}
        </div>

        <div className="mt-2 flex flex-col space-y-2.5">
          <Button 
            onClick={handleApply} 
            variant="primary"
            className="h-10 px-3 rounded-xl w-full" 
          >
            {applyText}
          </Button>
          
          <div className="flex space-x-2.5">
            <Button
              onClick={handleClear}
              variant="light"
              className="h-10 px-3 rounded-xl flex-1" 
            >
              {clearText}
            </Button>
            
            <Button
              onClick={onClose}
              variant="light"
              className="h-10 px-3 rounded-xl flex-1" 
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </TransitionChild>
    </Transition>
  );
}
