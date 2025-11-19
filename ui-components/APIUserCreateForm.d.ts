import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type APIUserCreateFormInputValues = {
    email?: string;
    credit_card_last4?: string;
    payment_method_id?: string;
    stripe_customer_id?: string;
    total_spent?: number;
};
export declare type APIUserCreateFormValidationValues = {
    email?: ValidationFunction<string>;
    credit_card_last4?: ValidationFunction<string>;
    payment_method_id?: ValidationFunction<string>;
    stripe_customer_id?: ValidationFunction<string>;
    total_spent?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type APIUserCreateFormOverridesProps = {
    APIUserCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    credit_card_last4?: PrimitiveOverrideProps<TextFieldProps>;
    payment_method_id?: PrimitiveOverrideProps<TextFieldProps>;
    stripe_customer_id?: PrimitiveOverrideProps<TextFieldProps>;
    total_spent?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type APIUserCreateFormProps = React.PropsWithChildren<{
    overrides?: APIUserCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: APIUserCreateFormInputValues) => APIUserCreateFormInputValues;
    onSuccess?: (fields: APIUserCreateFormInputValues) => void;
    onError?: (fields: APIUserCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: APIUserCreateFormInputValues) => APIUserCreateFormInputValues;
    onValidate?: APIUserCreateFormValidationValues;
} & React.CSSProperties>;
export default function APIUserCreateForm(props: APIUserCreateFormProps): React.ReactElement;
