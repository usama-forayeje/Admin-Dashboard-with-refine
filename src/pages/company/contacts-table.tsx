import { useParams } from "react-router";

import { FilterDropdown, useTable } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Select, Space, Table } from "antd";

import { Contact } from "@/graphql/schema.types";

import { COMPANY_CONTACTS_TABLE_QUERY } from "@/graphql/queries";

import { CompanyContactsTableQuery } from "@/graphql/types";
import { Text } from "@/components/text";
import CustomAvatar from "@/components/custom-avatar";
import { statusOptions } from "@/constant";
import { ContactStatusTag } from "@/components/tags/contact-status-tag";

// Component to display company contacts in a table
export const CompanyContactsTable = () => {
  // Extract parameters from the URL (e.g., company ID)
  const params = useParams();

  /**
   * Refine's useTable hook is used to fetch and manage table data.
   * It comes with built-in support for sorting, filtering, and pagination.
   */
  const { tableProps } = useTable<GetFieldsFromList<CompanyContactsTableQuery>>(
    {
      resource: "contacts", // specify the resource to use (contacts)
      syncWithLocation: false, // disable syncing with location
      sorters: {
        initial: [
          {
            field: "createdAt", // sort by creation date
            order: "desc", // descending order
          },
        ],
      },
      filters: {
        initial: [
          { field: "jobTitle", value: "", operator: "contains" }, // initial filter for job title
          { field: "name", value: "", operator: "contains" }, // initial filter for name
          { field: "status", value: undefined, operator: "in" }, // initial filter for status
        ],
        permanent: [
          {
            field: "company.id", // filter by company ID (from URL params)
            operator: "eq",
            value: params?.id as string,
          },
        ],
      },
      meta: {
        gqlQuery: COMPANY_CONTACTS_TABLE_QUERY, // GraphQL query to fetch data
      },
    },
  );

  return (
    <Card
      headStyle={{ borderBottom: "1px solid #D9D9D9", marginBottom: "1px" }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          <TeamOutlined />
          <Text>Contacts</Text>
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">Total contacts: </Text>
          <Text strong>
            {tableProps?.pagination !== false && tableProps.pagination?.total}
          </Text>
        </>
      }
    >
      <Table
        {...tableProps} // Spread table properties to apply pagination, sorting, etc.
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: false, // Disable page size changer
        }}
      >
        {/* Column for displaying contact name */}
        <Table.Column<Contact>
          title="Name"
          dataIndex="name"
          render={(_, record) => (
            <Space>
              <CustomAvatar name={record.name} src={record.avatarUrl} />
              <Text style={{ whiteSpace: "nowrap" }}>
                {record.name}
              </Text>
            </Space>
          )}
          filterIcon={<SearchOutlined />} // Icon for the filter dropdown
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Name" />
            </FilterDropdown>
          )}
        />
        
        {/* Column for displaying job title */}
        <Table.Column
          title="Title"
          dataIndex="jobTitle"
          filterIcon={<SearchOutlined />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search Title" />
            </FilterDropdown>
          )}
        />

        {/* Column for displaying contact status with a tag */}
        <Table.Column<Contact>
          title="Stage"
          dataIndex="status"
          render={(_, record) => <ContactStatusTag status={record.status} />}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: "200px" }}
                mode="multiple" // Allow multiple selection
                placeholder="Select Stage"
                options={statusOptions} // Options for contact statuses
              />
            </FilterDropdown>
          )}
        />
        
        {/* Column with actions to email or call the contact */}
        <Table.Column<Contact>
          dataIndex="id"
          width={112}
          render={(_, record) => (
            <Space>
              <Button
                size="small"
                href={`mailto:${record.email}`}
                icon={<MailOutlined />}
              />
              <Button
                size="small"
                href={`tel:${record.phone}`}
                icon={<PhoneOutlined />}
              />
            </Space>
          )}
        />
      </Table>
    </Card>
  );
};
