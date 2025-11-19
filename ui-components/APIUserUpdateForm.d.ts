import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { APIUser } from "./graphql/types";
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
export declare type APIUserUpdateFormInputValues = {
    email?: string;
    credit_card_last4?: string;
    payment_method_id?: string;
    stripe_customer_id?: string;
    total_spent?: number;
};
export declare type APIUserUpdateFormValidationValues = {
    email?: ValidationFunction<string>;
    credit_card_last4?: ValidationFunction<string>;
    payment_method_id?: ValidationFunction<string>;
    stripe_customer_id?: ValidationFunction<string>;
    total_spent?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type APIUserUpdateFormOverridesProps = {
    APIUserUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    credit_card_last4?: PrimitiveOverrideProps<TextFieldProps>;
    payment_method_id?: PrimitiveOverrideProps<TextFieldProps>;
    stripe_customer_id?: PrimitiveOverrideProps<TextFieldProps>;
    total_spent?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type APIUserUpdateFormProps = React.PropsWithChildren<{
    overrides?: APIUserUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    aPIUser?: APIUser;
    onSubmit?: (fields: APIUserUpdateFormInputValues) => APIUserUpdateFormInputValues;
    onSuccess?: (fields: APIUserUpdateFormInputValues) => void;
    onError?: (fields: APIUserUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: APIUserUpdateFormInputValues) => APIUserUpdateFormInputValues;
    onValidate?: APIUserUpdateFormValidationValues;
} & React.CSSProperties>;
export default function APIUserUpdateForm(props: APIUserUpdateFormProps): React.ReactElement;
