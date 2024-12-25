import { Form, Input, Modal, Select } from 'antd'
import { useModalForm, useSelect } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { UsersSelectQuery } from '@/graphql/types'
import { CompanyList } from './list'
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutations'
import SelectOptionWithAvatar from '@/components/select-option-with-avatar'

const Create = () => {
  const go = useGo(); // Hook for navigating to different pages in the application

  // Function to navigate to the company list page
  const goToListPage = () => {
    go({
      to: { resource: 'companies', action: 'list' }, // Navigate to the list page of companies
      options: { keepQuery: true }, // Keep query parameters in the URL
      type: 'replace', // Replace the current URL without adding a new entry in the browser history
    })
  }

  // Modal form configuration using the `useModalForm` hook
  const { formProps, modalProps } = useModalForm({
    action: 'create', // Action type: create a new company
    defaultVisible: true, // Make the modal visible by default
    resource: 'companies', // The resource we are creating (companies)
    redirect: false, // Disable automatic redirection after successful mutation
    mutationMode: 'pessimistic', // Pessimistic mutation mode (sends data and waits for confirmation)
    onMutationSuccess: goToListPage, // Redirect to the company list on success
    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION // GraphQL mutation to create a company
    }
  })

  // Select hook to fetch users and show them as options in the sales owner field
  const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: 'users', // Resource to fetch data from (users)
    optionLabel: 'name', // Label to display in the select dropdown (user names)
    meta: {
      gqlQuery: USERS_SELECT_QUERY // GraphQL query to fetch user data
    }
  })

  return (
    <CompanyList> {/* Wrapper component for company list */}
      <Modal
        {...modalProps} // Spread modal properties to the modal component
        mask={true} // Display a mask behind the modal
        onCancel={goToListPage} // Close the modal and go to the list page on cancel
        title="Create Company" // Modal title
        width={512} // Modal width
      >
        <Form {...formProps} layout="vertical"> {/* Form for company creation */}
          <Form.Item
            label="Company name" // Label for the company name field
            name="name" // Name of the field in the form
            rules={[{ required: true }]} // Field is required
          >
            <Input placeholder="Please enter a company name" /> {/* Input for company name */}
          </Form.Item>
          
          <Form.Item
            label="Sales owner" // Label for the sales owner field
            name="salesOwnerId" // Name of the field for sales owner ID
            rules={[{ required: true }]} // Field is required
          >
            <Select 
              placeholder="Please select a sales owner" // Placeholder for the select field
              {...selectProps} // Spread select properties for user options
              options={
                queryResult.data?.data.map((user) => ({
                  value: user.id, // Value to be sent when selected
                  label: (
                    <SelectOptionWithAvatar 
                      name={user.name} // Display user name
                      avatarUrl={user.avatarUrl ?? undefined} // Display avatar if available
                    />
                  )
                })) ?? [] // Default to an empty array if no data is available
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </CompanyList>
  )
}

export default Create
