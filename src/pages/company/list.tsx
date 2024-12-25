import CustomAvatar from "@/components/custom-avatar"
import { Text } from "@/components/text"
import { COMPANIES_LIST_QUERY } from "@/graphql/queries"
import type { Company } from "@/graphql/schema.types"
import type { CompaniesListQuery } from "@/graphql/types"
import { currencyNumber } from "@/utils"
import { SearchOutlined } from "@ant-design/icons"
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from '@refinedev/antd'
import { HttpError, getDefaultFilter, useGo } from '@refinedev/core'
import type { GetFieldsFromList } from "@refinedev/nestjs-query"
import { Input, Space, Table } from "antd"

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  // `useGo` hook allows for navigation to different pages
  const go = useGo();

  // Using the `useTable` hook from `@refinedev/antd` to manage table data, filters, and pagination
  const { tableProps, filters } = useTable< 
    GetFieldsFromList<CompaniesListQuery>, // Type for the query result
    HttpError, // Type for HTTP errors
    GetFieldsFromList<CompaniesListQuery> // Type for filter values
  >({
    resource: 'companies', // The resource we're working with (companies)
    onSearch: (values) => {
      return [
        {
          field: 'name', // We want to search by company name
          operator: 'contains', // Search for partial matches
          value: values.name // Search term entered by the user
        }
      ]
    },
    pagination: {
      pageSize: 12, // Set the number of records per page
    },
    sorters: {
      initial: [
        {
          field: 'createdAt', // Sort by creation date
          order: 'desc' // Sort in descending order (newest first)
        }
      ]
    },
    filters: {
      initial: [
        {
          field: 'name', // Filter by company name
          operator: 'contains', // Match partial names
          value: undefined // Initially, the filter value is empty
        }
      ]
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY // The GraphQL query for fetching the list of companies
    }
  });

  return (
    <div>
      {/* List component that wraps the table */}
      <List
        breadcrumb={false} // Disable breadcrumb navigation
        headerButtons={() => (
          <CreateButton 
            onClick={() => {
              go({
                to: {
                  resource: 'companies',
                  action: 'create' // Navigate to the company creation page
                },
                options: {
                  keepQuery: true // Keep the query parameters when navigating
                },
                type: 'replace' // Replace the current page in the browser history
              })
            }}
          />
        )}
      >
        {/* Table component to display the list of companies */}
        <Table
          {...tableProps} // Spread the table properties
          pagination={{
            ...tableProps.pagination, // Include pagination settings
          }}
        >
          {/* Column for the company name */}
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            defaultFilteredValue={getDefaultFilter('id', filters)} // Default filter value for company id
            filterIcon={<SearchOutlined />} // Icon for the filter
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" /> {/* Search field for company name */}
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                {/* Custom avatar component to display the company's avatar */}
                <CustomAvatar shape="square" name={record.name} src={record.avatarUrl} />
                <Text style={{ whiteSpace: 'nowrap' }}>
                  {record.name} {/* Display the company name */}
                </Text>
              </Space>
            )}
          />
          
          {/* Column for displaying the total revenue from open deals */}
          <Table.Column<Company>
            dataIndex="totalRevenue"
            title="Open deals amount"
            render={(value, company) => (
              <Text>
                {/* Format and display the total revenue value */}
                {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}
              </Text>
            )}
          />

          {/* Column for actions (edit and delete buttons) */}
          <Table.Column<Company>
            dataIndex="id"
            title="Actions"
            fixed="right" // Fix this column to the right side
            render={(value) => (
              <Space>
                {/* Edit and delete buttons for each company */}
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {/* Render any children passed to the CompanyList component */}
      {children}
    </div>
  )
}
