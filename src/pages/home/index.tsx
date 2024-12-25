import { DealChart, LatestActivities, UpcomingEvents } from "@/components";
import DashboardTotalCountCard from "@/components/home/total-count-card";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import type { DashboardTotalCountsQuery } from "@/graphql/types";
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";

export const Home = () => {
  // Custom hook to fetch total counts for the dashboard using GraphQL query
  const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
    url: "", // URL is empty as we are using GraphQL
    method: "get", // GET request to fetch data
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY, // The query used to fetch the total counts
    },
  });

  return (
    <div>
      {/* Row for displaying the total counts for companies, contacts, and deals */}
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies" // Resource being displayed (companies)
            isLoading={isLoading} // Loading state
            totalCount={data?.data.companies.totalCount} // Total count for companies
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts" // Resource being displayed (contacts)
            isLoading={isLoading} // Loading state
            totalCount={data?.data.contacts.totalCount} // Total count for contacts
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals" // Resource being displayed (deals)
            isLoading={isLoading} // Loading state
            totalCount={data?.data.deals.totalCount} // Total count for deals
          />
        </Col>
      </Row>

      {/* Row for displaying the upcoming events and deal chart */}
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <UpcomingEvents /> {/* Component showing upcoming events */}
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DealChart /> {/* Component showing deal statistics chart */}
        </Col>
      </Row>

      {/* Row for displaying the latest activities */}
      <Row
        gutter={[32, 32]}
        style={{
          marginTop: '32px' // Adds space between the rows
        }}
      >
        <Col xs={24}>
          <LatestActivities /> {/* Component displaying the latest activities */}
        </Col>
      </Row>
    </div>
  );
};
