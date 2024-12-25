import { Card, Skeleton } from "antd";

// ProjectCardSkeleton component, used to display a loading skeleton for a project card
const ProjectCardSkeleton = () => {
  return (
    <Card
      size="small" // Sets the size of the card to small
      bodyStyle={{
        display: "flex", // Uses flexbox for the layout inside the card
        justifyContent: "center", // Centers the content horizontally
        gap: "8px", // Adds a gap between elements inside the card
      }}
      title={
        // Skeleton button as a placeholder for the card title
        <Skeleton.Button
          active // Adds animation to show it's loading
          size="small" // Sets the button size to small
          style={{
            width: "200px", // Sets the width of the skeleton button
            height: "22px", // Sets the height of the skeleton button
          }}
        />
      }
    >
      {/* Skeleton button as a placeholder for additional information */}
      <Skeleton.Button
        active // Adds animation to show it's loading
        size="small" // Sets the button size to small
        style={{
          width: "200px", // Sets the width of the skeleton button
        }}
      />
      
      {/* Skeleton avatar as a placeholder for the avatar image */}
      <Skeleton.Avatar active size="small" />
    </Card>
  );
};

export default ProjectCardSkeleton;
