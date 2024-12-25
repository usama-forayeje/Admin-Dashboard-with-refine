import { useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import { GetFields, GetFieldsFromList, GetVariables } from "@refinedev/nestjs-query";

import { FlagOutlined } from "@ant-design/icons";
import { Checkbox, Form, Select, Space } from "antd";

import { AccordionHeaderSkeleton } from "@/components";
import { TaskStagesSelectQuery, UpdateTaskMutation, UpdateTaskMutationVariables } from "@/graphql/types";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_SELECT_QUERY } from "@/graphql/queries";

type Props = {
  isLoading?: boolean; // Indicates if data is still loading
};

export const StageForm = ({ isLoading }: Props) => {
  // use the useForm hook to manage the form for adding a stage to a task
  const { formProps } = useForm< 
    GetFields<UpdateTaskMutation>,
    HttpError,
    Pick<GetVariables<UpdateTaskMutationVariables>, "stageId" | "completed">
  >({
    queryOptions: {
      enabled: false, // Disable the query to prevent fetching on mount
    },
    autoSave: {
      enabled: true, // Enable autoSave
      debounce: 0, // Save immediately when a change occurs
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION, // Mutation to update the task
    },
  });

  // use the useSelect hook to fetch the task stages and pass it to the select component
  const { selectProps } = useSelect<GetFieldsFromList<TaskStagesSelectQuery>>({
    resource: "taskStages", // Fetch data from "taskStages"
    filters: [
      {
        field: "title", // Filter stages by title
        operator: "in", // Fetch stages with specific titles
        value: ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"],
      },
    ],
    sorters: [
      {
        field: "createdAt", // Sort stages by created date
        order: "asc",
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_SELECT_QUERY, // Query for fetching task stages
    },
  });

  // Show a skeleton loader while data is being fetched
  if (isLoading) return <AccordionHeaderSkeleton />;

  return (
    <div style={{ padding: "12px 24px", borderBottom: "1px solid #d9d9d9" }}>
      <Form
        layout="inline" // Inline layout for the form
        style={{
          justifyContent: "space-between", // Space between form elements
          alignItems: "center",
        }}
        {...formProps}
      >
        <Space size={5}>
          <FlagOutlined /> {/* Display an icon for the stage selection */}
          <Form.Item
            noStyle
            name={["stageId"]} // Name of the form field for the stage
            initialValue={formProps?.initialValues?.stage?.id} // Set initial value to the current stage id
          >
            <Select
              {...selectProps}
              popupMatchSelectWidth={false} // Set dropdown width to not match select box width
              options={selectProps.options?.concat([ // Add an "Unassigned" option
                {
                  label: "Unassigned",
                  value: null,
                },
              ])}
              bordered={false}
              showSearch={false} // Disable search in the select box
              placeholder="Select a stage" // Placeholder text for the dropdown
              size="small" // Set size to small
            />
          </Form.Item>
        </Space>
        <Form.Item noStyle name="completed" valuePropName="checked">
          <Checkbox>Mark as complete</Checkbox> {/* Checkbox to mark the task as completed */}
        </Form.Item>
      </Form>
    </div>
  );
};
