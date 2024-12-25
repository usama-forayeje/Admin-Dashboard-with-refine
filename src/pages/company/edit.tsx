import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
import { Edit, useForm, useSelect } from '@refinedev/antd'
import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutations';
import CustomAvatar from '@/components/custom-avatar';
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { UsersSelectQuery } from '@/graphql/types';
import { USERS_SELECT_QUERY } from '@/graphql/queries';
import SelectOptionWithAvatar from '@/components/select-option-with-avatar';
import { getNameInitials } from '@/utils';
import { businessTypeOptions, companySizeOptions, industryOptions } from '@/constant';
import { CompanyContactsTable } from './contacts-table';

const EditPage = () => {
  // Using the `useForm` hook from Refine to handle the form submission and loading state
  const { saveButtonProps, formProps, formLoading, queryResult } = useForm({
    redirect: false, // Do not redirect after saving
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION // Mutation to update the company data
    }
  });

  // Destructure company data (avatarUrl and name) from queryResult
  const { avatarUrl, name } = queryResult?.data?.data || {}

  // Select hook to fetch users and show them as options in the sales owner field
  const { selectProps, queryResult: queryResultUsers } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: 'users', // Fetch data from the 'users' resource
    optionLabel: 'name', // Display user names as the label in the select dropdown
    pagination: {
      mode: 'off' // Disable pagination for users (all users will be loaded)
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY // GraphQL query to fetch user data
    }
  })

  return (
    <div>
      <Row gutter={[32, 32]}> {/* Layout structure with gutter spacing */}
        <Col xs={24} xl={12}> {/* First column (company info) */}
          <Edit 
            isLoading={formLoading} // Show loading state while the form is loading
            saveButtonProps={saveButtonProps} // Save button properties
            breadcrumb={false} // Disable breadcrumb navigation
          >
            <Form {...formProps} layout='vertical'> {/* Form layout with vertical alignment */}
              {/* Display company avatar */}
              <CustomAvatar 
                shape="square" 
                src={avatarUrl} 
                name={getNameInitials(name || '')} // Display initials of the company name
                style={{ width: 96, height: 96, marginBottom: '24px' }} 
              />
              
              {/* Sales Owner select field */}
              <Form.Item
                label="Sales owner"
                name="salesOwnerId"
                initialValue={formProps?.initialValues?.salesOwner?.id} // Set the initial value from the form props
              >
                <Select 
                  placeholder="Please select a sales owner"
                  {...selectProps} // Spread select props for user options
                  options={
                    queryResultUsers.data?.data.map((user) => ({
                      value: user.id, // User ID as the value
                      label: (
                        <SelectOptionWithAvatar 
                          name={user.name} // User name to display
                          avatarUrl={user.avatarUrl ?? undefined} // User avatar, if available
                        />
                      )
                    })) ?? [] // If no users, return an empty array
                  }
                />
              </Form.Item>

              {/* Company Size select field */}
              <Form.Item>
                <Select options={companySizeOptions} /> {/* Company size options */}
              </Form.Item>

              {/* Company Revenue input field */}
              <Form.Item>
                <InputNumber 
                  autoFocus
                  addonBefore='$' // Display dollar sign before input
                  min={0} // Minimum value
                  placeholder="0,00" // Placeholder text
                />
              </Form.Item>

              {/* Industry select field */}
              <Form.Item label="Industry">
                <Select options={industryOptions} /> {/* Industry options */}
              </Form.Item>

              {/* Business Type select field */}
              <Form.Item label="Business type">
                <Select options={businessTypeOptions} /> {/* Business type options */}
              </Form.Item>

              {/* Country input field */}
              <Form.Item label="Country" name="country">
                <Input placeholder='Country' /> {/* Country input */}
              </Form.Item>

              {/* Website input field */}
              <Form.Item label="Website" name="website">
                <Input placeholder="Website" /> {/* Website input */}
              </Form.Item>

            </Form>
          </Edit>
        </Col>

        {/* Second column (company contacts table) */}
        <Col xs={24} xl={12}>
          <CompanyContactsTable /> {/* Company contacts table component */}
        </Col>
      </Row>
    </div>
  )
}

export default EditPage
