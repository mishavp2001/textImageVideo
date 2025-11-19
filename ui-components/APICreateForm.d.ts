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
export declare type APICreateFormInputValues = {
    name?: string;
    description?: string;
    endpoint_url?: string;
    method?: string;
    category?: string;
    status?: string;
    free_requests_limit?: number;
    price_per_request?: number;
    example_request?: string;
    example_response?: string;
    headers_required?: string[];
    total_requests?: number;
    total_revenue?: number;
    owner_id?: string;
};
export declare type APICreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    endpoint_url?: ValidationFunction<string>;
    method?: ValidationFunction<string>;
    category?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    free_requests_limit?: ValidationFunction<number>;
    price_per_request?: ValidationFunction<number>;
    example_request?: ValidationFunction<string>;
    example_response?: ValidationFunction<string>;
    headers_required?: ValidationFunction<string>;
    total_requests?: ValidationFunction<number>;
    total_revenue?: ValidationFunction<number>;
    owner_id?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type APICreateFormOverridesProps = {
    APICreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    endpoint_url?: PrimitiveOverrideProps<TextFieldProps>;
    method?: PrimitiveOverrideProps<TextFieldProps>;
    category?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    free_requests_limit?: PrimitiveOverrideProps<TextFieldProps>;
    price_per_request?: PrimitiveOverrideProps<TextFieldProps>;
    example_request?: PrimitiveOverrideProps<TextAreaFieldProps>;
    example_response?: PrimitiveOverrideProps<TextAreaFieldProps>;
    headers_required?: PrimitiveOverrideProps<TextFieldProps>;
    total_requests?: PrimitiveOverrideProps<TextFieldProps>;
    total_revenue?: PrimitiveOverrideProps<TextFieldProps>;
    owner_id?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type APICreateFormProps = React.PropsWithChildren<{
    overrides?: APICreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: APICreateFormInputValues) => APICreateFormInputValues;
    onSuccess?: (fields: APICreateFormInputValues) => void;
    onError?: (fields: APICreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: APICreateFormInputValues) => APICreateFormInputValues;
    onValidate?: APICreateFormValidationValues;
} & React.CSSProperties>;
export default function APICreateForm(props: APICreateFormProps): React.ReactElement;
