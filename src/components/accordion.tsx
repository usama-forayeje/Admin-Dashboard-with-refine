import { AccordionHeaderSkeleton } from "@/components"; // Import skeleton component for loading state
import { Text } from "./text"; // Import Text component for text rendering

type Props = React.PropsWithChildren<{
  accordionKey: string; // Unique key for each accordion item
  activeKey?: string; // Currently active accordion key, undefined means no active item
  setActive: (key?: string) => void; // Function to update the active key
  fallback: string | React.ReactNode; // Fallback content shown when the accordion is not active
  isLoading?: boolean; // Optional loading state to display skeleton while data is loading
  icon: React.ReactNode; // Icon displayed next to the accordion header
  label: string; // Label for the accordion item
}>;

/**
 * Accordion component that renders different content based on its active state.
 * - When activeKey equals accordionKey, children will be displayed.
 * - If isLoading is true, a loading skeleton is shown.
 * - On click, setActive is called to toggle the active state of the accordion.
 */
export const Accordion = ({
  accordionKey,  // The unique key for this accordion item
  activeKey,     // The currently active accordion key
  setActive,     // Function to set the active accordion item
  fallback,      // Content shown when the accordion is not active
  icon,          // Icon to display beside the label
  label,         // Label for the accordion item
  children,      // The content to show when the accordion is expanded
  isLoading,     // Loading state for skeleton view
}: Props) => {
  // If isLoading is true, display the skeleton loader
  if (isLoading) return <AccordionHeaderSkeleton />;

  // Determine if the current accordion item is active
  const isActive = activeKey === accordionKey;

  // Function to toggle the active state of the accordion
  const toggleAccordion = () => {
    if (isActive) {
      setActive(undefined); // If active, close the accordion
    } else {
      setActive(accordionKey); // Otherwise, open the accordion
    }
  };

  return (
    <div
      style={{
        display: "flex",             // Flexbox layout for the accordion item
        padding: "12px 24px",        // Padding around the accordion item
        gap: "12px",                 // Space between icon and content
        alignItems: "start",         // Align items at the start
        borderBottom: "1px solid #d9d9d9", // Border at the bottom of each item
      }}
    >
      <div style={{ marginTop: "1px", flexShrink: 0 }}>{icon}</div> {/* Render the icon */}
      
      {/* Conditional rendering based on whether the accordion is active */}
      {isActive ? (
        <div
          style={{
            display: "flex",            // Flexbox layout for expanded content
            flexDirection: "column",    // Stack children vertically
            gap: "12px",                // Space between label and content
            flex: 1,                    // Allow the content to take full available width
          }}
        >
          {/* Render the label and make it clickable to toggle the accordion */}
          <Text strong onClick={toggleAccordion} style={{ cursor: "pointer" }}>
            {label}
          </Text>
          {children} {/* Render the children when active */}
        </div>
      ) : (
        <div onClick={toggleAccordion} style={{ cursor: "pointer", flex: 1 }}>
          {/* Render the fallback content when the accordion is not active */}
          {fallback}
        </div>
      )}
    </div>
  );
};
