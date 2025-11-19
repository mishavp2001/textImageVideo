/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAPIKey } from "./graphql/queries";
import { updateAPIKey } from "./graphql/mutations";
const client = generateClient();
export default function APIKeyUpdateForm(props) {
  const {
    id: idProp,
    aPIKey: aPIKeyModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    user_email: "",
    key: "",
    status: "",
    requests_made: "",
    requests_this_month: "",
    total_spent: "",
    last_used: "",
  };
  const [user_email, setUser_email] = React.useState(initialValues.user_email);
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
    const cleanValues = aPIKeyRecord
      ? { ...initialValues, ...aPIKeyRecord }
      : initialValues;
    setUser_email(cleanValues.user_email);
    setKey(cleanValues.key);
    setStatus(cleanValues.status);
    setRequests_made(cleanValues.requests_made);
    setRequests_this_month(cleanValues.requests_this_month);
    setTotal_spent(cleanValues.total_spent);
    setLast_used(cleanValues.last_used);
    setErrors({});
  };
  const [aPIKeyRecord, setAPIKeyRecord] = React.useState(aPIKeyModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAPIKey.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAPIKey
        : aPIKeyModelProp;
      setAPIKeyRecord(record);
    };
    queryData();
  }, [idProp, aPIKeyModelProp]);
  React.useEffect(resetStateValues, [aPIKeyRecord]);
  const validations = {
    user_email: [],
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
          user_email: user_email ?? null,
          key,
          status: status ?? null,
          requests_made: requests_made ?? null,
          requests_this_month: requests_this_month ?? null,
          total_spent: total_spent ?? null,
          last_used: last_used ?? null,
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
            query: updateAPIKey.replaceAll("__typename", ""),
            variables: {
              input: {
                id: aPIKeyRecord.id,
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
      {...getOverrideProps(overrides, "APIKeyUpdateForm")}
      {...rest}
    >
      <TextField
        label="User email"
        isRequired={false}
        isReadOnly={false}
        value={user_email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_email: value,
              key,
              status,
              requests_made,
              requests_this_month,
              total_spent,
              last_used,
            };
            const result = onChange(modelFields);
            value = result?.user_email ?? value;
          }
          if (errors.user_email?.hasError) {
            runValidationTasks("user_email", value);
          }
          setUser_email(value);
        }}
        onBlur={() => runValidationTasks("user_email", user_email)}
        errorMessage={errors.user_email?.errorMessage}
        hasError={errors.user_email?.hasError}
        {...getOverrideProps(overrides, "user_email")}
      ></TextField>
      <TextField
        label="Key"
        isRequired={true}
        isReadOnly={false}
        value={key}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              user_email,
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
              user_email,
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
              user_email,
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
              user_email,
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
              user_email,
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
              user_email,
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
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || aPIKeyModelProp)}
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
              !(idProp || aPIKeyModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
