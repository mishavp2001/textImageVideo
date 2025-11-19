/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAPIUser } from "./graphql/queries";
import { updateAPIUser } from "./graphql/mutations";
const client = generateClient();
export default function APIUserUpdateForm(props) {
  const {
    id: idProp,
    aPIUser: aPIUserModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    email: "",
    credit_card_last4: "",
    payment_method_id: "",
    stripe_customer_id: "",
    total_spent: "",
  };
  const [email, setEmail] = React.useState(initialValues.email);
  const [credit_card_last4, setCredit_card_last4] = React.useState(
    initialValues.credit_card_last4
  );
  const [payment_method_id, setPayment_method_id] = React.useState(
    initialValues.payment_method_id
  );
  const [stripe_customer_id, setStripe_customer_id] = React.useState(
    initialValues.stripe_customer_id
  );
  const [total_spent, setTotal_spent] = React.useState(
    initialValues.total_spent
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = aPIUserRecord
      ? { ...initialValues, ...aPIUserRecord }
      : initialValues;
    setEmail(cleanValues.email);
    setCredit_card_last4(cleanValues.credit_card_last4);
    setPayment_method_id(cleanValues.payment_method_id);
    setStripe_customer_id(cleanValues.stripe_customer_id);
    setTotal_spent(cleanValues.total_spent);
    setErrors({});
  };
  const [aPIUserRecord, setAPIUserRecord] = React.useState(aPIUserModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAPIUser.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAPIUser
        : aPIUserModelProp;
      setAPIUserRecord(record);
    };
    queryData();
  }, [idProp, aPIUserModelProp]);
  React.useEffect(resetStateValues, [aPIUserRecord]);
  const validations = {
    email: [{ type: "Required" }],
    credit_card_last4: [],
    payment_method_id: [],
    stripe_customer_id: [],
    total_spent: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          email,
          credit_card_last4: credit_card_last4 ?? null,
          payment_method_id: payment_method_id ?? null,
          stripe_customer_id: stripe_customer_id ?? null,
          total_spent: total_spent ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateAPIUser.replaceAll("__typename", ""),
            variables: {
              input: {
                id: aPIUserRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "APIUserUpdateForm")}
      {...rest}
    >
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email: value,
              credit_card_last4,
              payment_method_id,
              stripe_customer_id,
              total_spent,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Credit card last4"
        isRequired={false}
        isReadOnly={false}
        value={credit_card_last4}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              credit_card_last4: value,
              payment_method_id,
              stripe_customer_id,
              total_spent,
            };
            const result = onChange(modelFields);
            value = result?.credit_card_last4 ?? value;
          }
          if (errors.credit_card_last4?.hasError) {
            runValidationTasks("credit_card_last4", value);
          }
          setCredit_card_last4(value);
        }}
        onBlur={() =>
          runValidationTasks("credit_card_last4", credit_card_last4)
        }
        errorMessage={errors.credit_card_last4?.errorMessage}
        hasError={errors.credit_card_last4?.hasError}
        {...getOverrideProps(overrides, "credit_card_last4")}
      ></TextField>
      <TextField
        label="Payment method id"
        isRequired={false}
        isReadOnly={false}
        value={payment_method_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              credit_card_last4,
              payment_method_id: value,
              stripe_customer_id,
              total_spent,
            };
            const result = onChange(modelFields);
            value = result?.payment_method_id ?? value;
          }
          if (errors.payment_method_id?.hasError) {
            runValidationTasks("payment_method_id", value);
          }
          setPayment_method_id(value);
        }}
        onBlur={() =>
          runValidationTasks("payment_method_id", payment_method_id)
        }
        errorMessage={errors.payment_method_id?.errorMessage}
        hasError={errors.payment_method_id?.hasError}
        {...getOverrideProps(overrides, "payment_method_id")}
      ></TextField>
      <TextField
        label="Stripe customer id"
        isRequired={false}
        isReadOnly={false}
        value={stripe_customer_id}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              email,
              credit_card_last4,
              payment_method_id,
              stripe_customer_id: value,
              total_spent,
            };
            const result = onChange(modelFields);
            value = result?.stripe_customer_id ?? value;
          }
          if (errors.stripe_customer_id?.hasError) {
            runValidationTasks("stripe_customer_id", value);
          }
          setStripe_customer_id(value);
        }}
        onBlur={() =>
          runValidationTasks("stripe_customer_id", stripe_customer_id)
        }
        errorMessage={errors.stripe_customer_id?.errorMessage}
        hasError={errors.stripe_customer_id?.hasError}
        {...getOverrideProps(overrides, "stripe_customer_id")}
      ></TextField>
      <TextField
        label="Total spent"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={total_spent}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              email,
              credit_card_last4,
              payment_method_id,
              stripe_customer_id,
              total_spent: value,
            };
            const result = onChange(modelFields);
            value = result?.total_spent ?? value;
          }
          if (errors.total_spent?.hasError) {
            runValidationTasks("total_spent", value);
          }
          setTotal_spent(value);
        }}
        onBlur={() => runValidationTasks("total_spent", total_spent)}
        errorMessage={errors.total_spent?.errorMessage}
        hasError={errors.total_spent?.hasError}
        {...getOverrideProps(overrides, "total_spent")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || aPIUserModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || aPIUserModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
