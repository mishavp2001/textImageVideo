import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { APIUsage } from "./graphql/types";
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
export declare type APIUsageUpdateFormInputValues = {
    request_method?: string;
    request_params?: string;
    response_status?: number;
    response_time?: number;
    cost?: number;
    timestamp?: string;
};
export declare type APIUsageUpdateFormValidationValues = {
    request_method?: ValidationFunction<string>;
    request_params?: ValidationFunction<string>;
    response_status?: ValidationFunction<number>;
    response_time?: ValidationFunction<number>;
    cost?: ValidationFunction<number>;
    timestamp?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type APIUsageUpdateFormOverridesProps = {
    APIUsageUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    request_method?: PrimitiveOverrideProps<TextFieldProps>;
    request_params?: PrimitiveOverrideProps<TextAreaFieldProps>;
    response_status?: PrimitiveOverrideProps<TextFieldProps>;
    response_time?: PrimitiveOverrideProps<TextFieldProps>;
    cost?: PrimitiveOverrideProps<TextFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type APIUsageUpdateFormProps = React.PropsWithChildren<{
    overrides?: APIUsageUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    aPIUsage?: APIUsage;
    onSubmit?: (fields: APIUsageUpdateFormInputValues) => APIUsageUpdateFormInputValues;
    onSuccess?: (fields: APIUsageUpdateFormInputValues) => void;
    onError?: (fields: APIUsageUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: APIUsageUpdateFormInputValues) => APIUsageUpdateFormInputValues;
    onValidate?: APIUsageUpdateFormValidationValues;
} & React.CSSProperties>;
export default function APIUsageUpdateForm(props: APIUsageUpdateFormProps): React.ReactElement;
