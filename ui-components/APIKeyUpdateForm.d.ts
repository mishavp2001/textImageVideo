import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { APIKey } from "./graphql/types";
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
export declare type APIKeyUpdateFormInputValues = {
    user_email?: string;
    key?: string;
    status?: string;
    requests_made?: number;
    requests_this_month?: number;
    total_spent?: number;
    last_used?: string;
};
export declare type APIKeyUpdateFormValidationValues = {
    user_email?: ValidationFunction<string>;
    key?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    requests_made?: ValidationFunction<number>;
    requests_this_month?: ValidationFunction<number>;
    total_spent?: ValidationFunction<number>;
    last_used?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type APIKeyUpdateFormOverridesProps = {
    APIKeyUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    user_email?: PrimitiveOverrideProps<TextFieldProps>;
    key?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    requests_made?: PrimitiveOverrideProps<TextFieldProps>;
    requests_this_month?: PrimitiveOverrideProps<TextFieldProps>;
    total_spent?: PrimitiveOverrideProps<TextFieldProps>;
    last_used?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type APIKeyUpdateFormProps = React.PropsWithChildren<{
    overrides?: APIKeyUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    aPIKey?: APIKey;
    onSubmit?: (fields: APIKeyUpdateFormInputValues) => APIKeyUpdateFormInputValues;
    onSuccess?: (fields: APIKeyUpdateFormInputValues) => void;
    onError?: (fields: APIKeyUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: APIKeyUpdateFormInputValues) => APIKeyUpdateFormInputValues;
    onValidate?: APIKeyUpdateFormValidationValues;
} & React.CSSProperties>;
export default function APIKeyUpdateForm(props: APIKeyUpdateFormProps): React.ReactElement;
