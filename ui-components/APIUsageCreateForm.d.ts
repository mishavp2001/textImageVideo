import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type APIUsageCreateFormInputValues = {
    request_method?: string;
    request_params?: string;
    response_status?: number;
    response_time?: number;
    cost?: number;
    timestamp?: string;
};
export declare type APIUsageCreateFormValidationValues = {
    request_method?: ValidationFunction<string>;
    request_params?: ValidationFunction<string>;
    response_status?: ValidationFunction<number>;
    response_time?: ValidationFunction<number>;
    cost?: ValidationFunction<number>;
    timestamp?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type APIUsageCreateFormOverridesProps = {
    APIUsageCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    request_method?: PrimitiveOverrideProps<TextFieldProps>;
    request_params?: PrimitiveOverrideProps<TextAreaFieldProps>;
    response_status?: PrimitiveOverrideProps<TextFieldProps>;
    response_time?: PrimitiveOverrideProps<TextFieldProps>;
    cost?: PrimitiveOverrideProps<TextFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type APIUsageCreateFormProps = React.PropsWithChildren<{
    overrides?: APIUsageCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: APIUsageCreateFormInputValues) => APIUsageCreateFormInputValues;
    onSuccess?: (fields: APIUsageCreateFormInputValues) => void;
    onError?: (fields: APIUsageCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: APIUsageCreateFormInputValues) => APIUsageCreateFormInputValues;
    onValidate?: APIUsageCreateFormValidationValues;
} & React.CSSProperties>;
export default function APIUsageCreateForm(props: APIUsageCreateFormProps): React.ReactElement;
