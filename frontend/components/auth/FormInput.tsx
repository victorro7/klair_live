import React from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    className,
    id,
    type,
    placeholder,
    ...props
}) => {
    return (
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            className={cn(
                "w-full bg-transparent border-b border-gray-600 hover:border-gray-400 focus:border-white text-white py-2 px-0 focus:outline-none placeholder:text-gray-500",
                className
            )}
            {...props}
        />
    );
};
