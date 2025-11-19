/* eslint-disable */
"use client";
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createAPI } from "./graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function APICreateForm(props) {
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
    name: "",
    description: "",
    endpoint_url: "",
    method: "",
    category: "",
    status: "",
    free_requests_limit: "",
    price_per_request: "",
    example_request: "",
    example_response: "",
    headers_required: [],
    total_requests: "",
    total_revenue: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [endpoint_url, setEndpoint_url] = React.useState(
    initialValues.endpoint_url
  );
  const [method, setMethod] = React.useState(initialValues.method);
  const [category, setCategory] = React.useState(initialValues.category);
  const [status, setStatus] = React.useState(initialValues.status);
  const [free_requests_limit, setFree_requests_limit] = React.useState(
    initialValues.free_requests_limit
  );
  const [price_per_request, setPrice_per_request] = React.useState(
    initialValues.price_per_request
  );
  const [example_request, setExample_request] = React.useState(
    initialValues.example_request
  );
  const [example_response, setExample_response] = React.useState(
    initialValues.example_response
  );
  const [headers_required, setHeaders_required] = React.useState(
    initialValues.headers_required
  );
  const [total_requests, setTotal_requests] = React.useState(
    initialValues.total_requests
  );
  const [total_revenue, setTotal_revenue] = React.useState(
    initialValues.total_revenue
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setEndpoint_url(initialValues.endpoint_url);
    setMethod(initialValues.method);
    setCategory(initialValues.category);
    setStatus(initialValues.status);
    setFree_requests_limit(initialValues.free_requests_limit);
    setPrice_per_request(initialValues.price_per_request);
    setExample_request(initialValues.example_request);
    setExample_response(initialValues.example_response);
    setHeaders_required(initialValues.headers_required);
    setCurrentHeaders_requiredValue("");
    setTotal_requests(initialValues.total_requests);
    setTotal_revenue(initialValues.total_revenue);
    setErrors({});
  };
  const [currentHeaders_requiredValue, setCurrentHeaders_requiredValue] =
    React.useState("");
  const headers_requiredRef = React.createRef();
  const validations = {
    name: [{ type: "Required" }],
    description: [],
    endpoint_url: [{ type: "Required" }],
    method: [],
    category: [],
    status: [],
    free_requests_limit: [],
    price_per_request: [],
    example_request: [{ type: "JSON" }],
    example_response: [{ type: "JSON" }],
    headers_required: [],
    total_requests: [],
    total_revenue: [],
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
          name,
          description,
          endpoint_url,
          method,
          category,
          status,
          free_requests_limit,
          price_per_request,
          example_request,
          example_response,
          headers_required,
          total_requests,
          total_revenue,
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
            query: createAPI.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "APICreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description: value,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Endpoint url"
        isRequired={true}
        isReadOnly={false}
        value={endpoint_url}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url: value,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.endpoint_url ?? value;
          }
          if (errors.endpoint_url?.hasError) {
            runValidationTasks("endpoint_url", value);
          }
          setEndpoint_url(value);
        }}
        onBlur={() => runValidationTasks("endpoint_url", endpoint_url)}
        errorMessage={errors.endpoint_url?.errorMessage}
        hasError={errors.endpoint_url?.hasError}
        {...getOverrideProps(overrides, "endpoint_url")}
      ></TextField>
      <TextField
        label="Method"
        isRequired={false}
        isReadOnly={false}
        value={method}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method: value,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.method ?? value;
          }
          if (errors.method?.hasError) {
            runValidationTasks("method", value);
          }
          setMethod(value);
        }}
        onBlur={() => runValidationTasks("method", method)}
        errorMessage={errors.method?.errorMessage}
        hasError={errors.method?.hasError}
        {...getOverrideProps(overrides, "method")}
      ></TextField>
      <TextField
        label="Category"
        isRequired={false}
        isReadOnly={false}
        value={category}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category: value,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.category ?? value;
          }
          if (errors.category?.hasError) {
            runValidationTasks("category", value);
          }
          setCategory(value);
        }}
        onBlur={() => runValidationTasks("category", category)}
        errorMessage={errors.category?.errorMessage}
        hasError={errors.category?.hasError}
        {...getOverrideProps(overrides, "category")}
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
              name,
              description,
              endpoint_url,
              method,
              category,
              status: value,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
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
        label="Free requests limit"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={free_requests_limit}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit: value,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.free_requests_limit ?? value;
          }
          if (errors.free_requests_limit?.hasError) {
            runValidationTasks("free_requests_limit", value);
          }
          setFree_requests_limit(value);
        }}
        onBlur={() =>
          runValidationTasks("free_requests_limit", free_requests_limit)
        }
        errorMessage={errors.free_requests_limit?.errorMessage}
        hasError={errors.free_requests_limit?.hasError}
        {...getOverrideProps(overrides, "free_requests_limit")}
      ></TextField>
      <TextField
        label="Price per request"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={price_per_request}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request: value,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.price_per_request ?? value;
          }
          if (errors.price_per_request?.hasError) {
            runValidationTasks("price_per_request", value);
          }
          setPrice_per_request(value);
        }}
        onBlur={() =>
          runValidationTasks("price_per_request", price_per_request)
        }
        errorMessage={errors.price_per_request?.errorMessage}
        hasError={errors.price_per_request?.hasError}
        {...getOverrideProps(overrides, "price_per_request")}
      ></TextField>
      <TextAreaField
        label="Example request"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request: value,
              example_response,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.example_request ?? value;
          }
          if (errors.example_request?.hasError) {
            runValidationTasks("example_request", value);
          }
          setExample_request(value);
        }}
        onBlur={() => runValidationTasks("example_request", example_request)}
        errorMessage={errors.example_request?.errorMessage}
        hasError={errors.example_request?.hasError}
        {...getOverrideProps(overrides, "example_request")}
      ></TextAreaField>
      <TextAreaField
        label="Example response"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response: value,
              headers_required,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.example_response ?? value;
          }
          if (errors.example_response?.hasError) {
            runValidationTasks("example_response", value);
          }
          setExample_response(value);
        }}
        onBlur={() => runValidationTasks("example_response", example_response)}
        errorMessage={errors.example_response?.errorMessage}
        hasError={errors.example_response?.hasError}
        {...getOverrideProps(overrides, "example_response")}
      ></TextAreaField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required: values,
              total_requests,
              total_revenue,
            };
            const result = onChange(modelFields);
            values = result?.headers_required ?? values;
          }
          setHeaders_required(values);
          setCurrentHeaders_requiredValue("");
        }}
        currentFieldValue={currentHeaders_requiredValue}
        label={"Headers required"}
        items={headers_required}
        hasError={errors?.headers_required?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "headers_required",
            currentHeaders_requiredValue
          )
        }
        errorMessage={errors?.headers_required?.errorMessage}
        setFieldValue={setCurrentHeaders_requiredValue}
        inputFieldRef={headers_requiredRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Headers required"
          isRequired={false}
          isReadOnly={false}
          value={currentHeaders_requiredValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.headers_required?.hasError) {
              runValidationTasks("headers_required", value);
            }
            setCurrentHeaders_requiredValue(value);
          }}
          onBlur={() =>
            runValidationTasks("headers_required", currentHeaders_requiredValue)
          }
          errorMessage={errors.headers_required?.errorMessage}
          hasError={errors.headers_required?.hasError}
          ref={headers_requiredRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "headers_required")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Total requests"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={total_requests}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests: value,
              total_revenue,
            };
            const result = onChange(modelFields);
            value = result?.total_requests ?? value;
          }
          if (errors.total_requests?.hasError) {
            runValidationTasks("total_requests", value);
          }
          setTotal_requests(value);
        }}
        onBlur={() => runValidationTasks("total_requests", total_requests)}
        errorMessage={errors.total_requests?.errorMessage}
        hasError={errors.total_requests?.hasError}
        {...getOverrideProps(overrides, "total_requests")}
      ></TextField>
      <TextField
        label="Total revenue"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={total_revenue}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              name,
              description,
              endpoint_url,
              method,
              category,
              status,
              free_requests_limit,
              price_per_request,
              example_request,
              example_response,
              headers_required,
              total_requests,
              total_revenue: value,
            };
            const result = onChange(modelFields);
            value = result?.total_revenue ?? value;
          }
          if (errors.total_revenue?.hasError) {
            runValidationTasks("total_revenue", value);
          }
          setTotal_revenue(value);
        }}
        onBlur={() => runValidationTasks("total_revenue", total_revenue)}
        errorMessage={errors.total_revenue?.errorMessage}
        hasError={errors.total_revenue?.hasError}
        {...getOverrideProps(overrides, "total_revenue")}
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
