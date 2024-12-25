import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../text";
import { Area, type AreaConfig } from "@ant-design/plots";
import { mapDealsData } from "@/utils/helpers";
import React from "react";
import { useList } from "@refinedev/core";
import type { GetFieldsFromList } from "@refinedev/nestjs-query";
import type { DashboardDealsChartQuery } from "@/graphql/types";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";

/**
 * DealChart Component
 * Displays a stacked area chart of deals data.
 */
function DealChart() {
  // Fetch data using useList hook with filters and GraphQL query.
  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["WON", "LOST"],
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  });

  // Transform the fetched data into a format suitable for the chart.
  const dealData = React.useMemo(() => mapDealsData(data?.data), [data?.data]);

  // Configuration for the Area chart.
  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    isStack: false, // Disable stacking for individual lines.
    seriesField: "state", // Separate series by deal state.
    animation: true, // Enable chart animations.
    startOnZero: false, // Avoid starting Y-axis from zero.
    smooth: true, // Smooth line transitions.
    legend: {
      offsetY: -6, // Adjust legend position.
    },
    yAxis: {
      tickCount: 4, // Limit number of ticks on the Y-axis.
      label: {
        formatter: (v: string) => `$${Number(v) / 1000}k`, // Format Y-axis labels.
      },
    },
    tooltip: {
      formatter: (data) => ({
        name: data.state,
        value: `$${Number(data.value) / 1000}k`, // Format tooltip values.
      }),
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0 24px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      {/* Render the Area chart with the configured properties */}
      <Area {...config} height={325} />
    </Card>
  );
}

export default DealChart;
