/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAPIUsage } from "./graphql/queries";
import { updateAPIUsage } from "./graphql/mutations";
const client = generateClient();
export default function APIUsageUpdateForm(props) {
  const {
    id: idProp,
    aPIUsage: aPIUsageModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    request_method: "",
    request_params: "",
    response_status: "",
    response_time: "",
    cost: "",
    timestamp: "",
  };
  const [request_method, setRequest_method] = React.useState(
    initialValues.request_method
  );
  const [request_params, setRequest_params] = React.useState(
    initialValues.request_params
  );
  const [response_status, setResponse_status] = React.useState(
    initialValues.response_status
  );
  const [response_time, setResponse_time] = React.useState(
    initialValues.response_time
  );
  const [cost, setCost] = React.useState(initialValues.cost);
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = aPIUsageRecord
      ? { ...initialValues, ...aPIUsageRecord }
      : initialValues;
    setRequest_method(cleanValues.request_method);
    setRequest_params(
      typeof cleanValues.request_params === "string" ||
        cleanValues.request_params === null
        ? cleanValues.request_params
        : JSON.stringify(cleanValues.request_params)
    );
    setResponse_status(cleanValues.response_status);
    setResponse_time(cleanValues.response_time);
    setCost(cleanValues.cost);
    setTimestamp(cleanValues.timestamp);
    setErrors({});
  };
  const [aPIUsageRecord, setAPIUsageRecord] = React.useState(aPIUsageModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAPIUsage.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAPIUsage
        : aPIUsageModelProp;
      setAPIUsageRecord(record);
    };
    queryData();
  }, [idProp, aPIUsageModelProp]);
  React.useEffect(resetStateValues, [aPIUsageRecord]);
  const validations = {
    request_method: [],
    request_params: [{ type: "JSON" }],
    response_status: [],
    response_time: [],
    cost: [],
    timestamp: [],
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
          request_method: request_method ?? null,
          request_params: request_params ?? null,
          response_status: response_status ?? null,
          response_time: response_time ?? null,
          cost: cost ?? null,
          timestamp: timestamp ?? null,
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
            query: updateAPIUsage.replaceAll("__typename", ""),
            variables: {
              input: {
                id: aPIUsageRecord.id,
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
      {...getOverrideProps(overrides, "APIUsageUpdateForm")}
      {...rest}
    >
      <TextField
        label="Request method"
        isRequired={false}
        isReadOnly={false}
        value={request_method}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              request_method: value,
              request_params,
              response_status,
              response_time,
              cost,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.request_method ?? value;
          }
          if (errors.request_method?.hasError) {
            runValidationTasks("request_method", value);
          }
          setRequest_method(value);
        }}
        onBlur={() => runValidationTasks("request_method", request_method)}
        errorMessage={errors.request_method?.errorMessage}
        hasError={errors.request_method?.hasError}
        {...getOverrideProps(overrides, "request_method")}
      ></TextField>
      <TextAreaField
        label="Request params"
        isRequired={false}
        isReadOnly={false}
        value={request_params}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              request_method,
              request_params: value,
              response_status,
              response_time,
              cost,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.request_params ?? value;
          }
          if (errors.request_params?.hasError) {
            runValidationTasks("request_params", value);
          }
          setRequest_params(value);
        }}
        onBlur={() => runValidationTasks("request_params", request_params)}
        errorMessage={errors.request_params?.errorMessage}
        hasError={errors.request_params?.hasError}
        {...getOverrideProps(overrides, "request_params")}
      ></TextAreaField>
      <TextField
        label="Response status"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={response_status}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              request_method,
              request_params,
              response_status: value,
              response_time,
              cost,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.response_status ?? value;
          }
          if (errors.response_status?.hasError) {
            runValidationTasks("response_status", value);
          }
          setResponse_status(value);
        }}
        onBlur={() => runValidationTasks("response_status", response_status)}
        errorMessage={errors.response_status?.errorMessage}
        hasError={errors.response_status?.hasError}
        {...getOverrideProps(overrides, "response_status")}
      ></TextField>
      <TextField
        label="Response time"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={response_time}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              request_method,
              request_params,
              response_status,
              response_time: value,
              cost,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.response_time ?? value;
          }
          if (errors.response_time?.hasError) {
            runValidationTasks("response_time", value);
          }
          setResponse_time(value);
        }}
        onBlur={() => runValidationTasks("response_time", response_time)}
        errorMessage={errors.response_time?.errorMessage}
        hasError={errors.response_time?.hasError}
        {...getOverrideProps(overrides, "response_time")}
      ></TextField>
      <TextField
        label="Cost"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={cost}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              request_method,
              request_params,
              response_status,
              response_time,
              cost: value,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.cost ?? value;
          }
          if (errors.cost?.hasError) {
            runValidationTasks("cost", value);
          }
          setCost(value);
        }}
        onBlur={() => runValidationTasks("cost", cost)}
        errorMessage={errors.cost?.errorMessage}
        hasError={errors.cost?.hasError}
        {...getOverrideProps(overrides, "cost")}
      ></TextField>
      <TextField
        label="Timestamp"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={timestamp && convertToLocal(new Date(timestamp))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              request_method,
              request_params,
              response_status,
              response_time,
              cost,
              timestamp: value,
            };
            const result = onChange(modelFields);
            value = result?.timestamp ?? value;
          }
          if (errors.timestamp?.hasError) {
            runValidationTasks("timestamp", value);
          }
          setTimestamp(value);
        }}
        onBlur={() => runValidationTasks("timestamp", timestamp)}
        errorMessage={errors.timestamp?.errorMessage}
        hasError={errors.timestamp?.hasError}
        {...getOverrideProps(overrides, "timestamp")}
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
          isDisabled={!(idProp || aPIUsageModelProp)}
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
              !(idProp || aPIUsageModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
