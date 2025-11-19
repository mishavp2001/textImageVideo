/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createAPIKey } from "./graphql/mutations";
const client = generateClient();
export default function APIKeyCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    key: "",
    status: "",
    requests_made: "",
    requests_this_month: "",
    total_spent: "",
    last_used: "",
  };
  const [key, setKey] = React.useState(initialValues.key);
  const [status, setStatus] = React.useState(initialValues.status);
  const [requests_made, setRequests_made] = React.useState(
    initialValues.requests_made
  );
  const [requests_this_month, setRequests_this_month] = React.useState(
    initialValues.requests_this_month
  );
  const [total_spent, setTotal_spent] = React.useState(
    initialValues.total_spent
  );
  const [last_used, setLast_used] = React.useState(initialValues.last_used);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setKey(initialValues.key);
    setStatus(initialValues.status);
    setRequests_made(initialValues.requests_made);
    setRequests_this_month(initialValues.requests_this_month);
    setTotal_spent(initialValues.total_spent);
    setLast_used(initialValues.last_used);
    setErrors({});
  };
  const validations = {
    key: [{ type: "Required" }],
    status: [],
    requests_made: [],
    requests_this_month: [],
    total_spent: [],
    last_used: [],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          key,
          status,
          requests_made,
          requests_this_month,
          total_spent,
          last_used,
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
            query: createAPIKey.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "APIKeyCreateForm")}
      {...rest}
    >
      <TextField
        label="Key"
        isRequired={true}
        isReadOnly={false}
        value={key}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              key: value,
              status,
              requests_made,
              requests_this_month,
              total_spent,
              last_used,
            };
            const result = onChange(modelFields);
            value = result?.key ?? value;
          }
          if (errors.key?.hasError) {
            runValidationTasks("key", value);
          }
          setKey(value);
        }}
        onBlur={() => runValidationTasks("key", key)}
        errorMessage={errors.key?.errorMessage}
        hasError={errors.key?.hasError}
        {...getOverrideProps(overrides, "key")}
      ></TextField>
      <TextField
        label="Status"
        isRequired={false}
        isReadOnly={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              key,
              status: value,
              requests_made,
              requests_this_month,
              total_spent,
              last_used,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      ></TextField>
      <TextField
        label="Requests made"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={requests_made}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              key,
              status,
              requests_made: value,
              requests_this_month,
              total_spent,
              last_used,
            };
            const result = onChange(modelFields);
            value = result?.requests_made ?? value;
          }
          if (errors.requests_made?.hasError) {
            runValidationTasks("requests_made", value);
          }
          setRequests_made(value);
        }}
        onBlur={() => runValidationTasks("requests_made", requests_made)}
        errorMessage={errors.requests_made?.errorMessage}
        hasError={errors.requests_made?.hasError}
        {...getOverrideProps(overrides, "requests_made")}
      ></TextField>
      <TextField
        label="Requests this month"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={requests_this_month}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              key,
              status,
              requests_made,
              requests_this_month: value,
              total_spent,
              last_used,
            };
            const result = onChange(modelFields);
            value = result?.requests_this_month ?? value;
          }
          if (errors.requests_this_month?.hasError) {
            runValidationTasks("requests_this_month", value);
          }
          setRequests_this_month(value);
        }}
        onBlur={() =>
          runValidationTasks("requests_this_month", requests_this_month)
        }
        errorMessage={errors.requests_this_month?.errorMessage}
        hasError={errors.requests_this_month?.hasError}
        {...getOverrideProps(overrides, "requests_this_month")}
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
              key,
              status,
              requests_made,
              requests_this_month,
              total_spent: value,
              last_used,
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
      <TextField
        label="Last used"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={last_used && convertToLocal(new Date(last_used))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              key,
              status,
              requests_made,
              requests_this_month,
              total_spent,
              last_used: value,
            };
            const result = onChange(modelFields);
            value = result?.last_used ?? value;
          }
          if (errors.last_used?.hasError) {
            runValidationTasks("last_used", value);
          }
          setLast_used(value);
        }}
        onBlur={() => runValidationTasks("last_used", last_used)}
        errorMessage={errors.last_used?.errorMessage}
        hasError={errors.last_used?.hasError}
        {...getOverrideProps(overrides, "last_used")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
