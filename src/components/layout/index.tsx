import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/antd'; // Refine components for themed layouts
import Header from './Header'; // Custom Header component

// Layout component definition with support for children
function Layout({ children }: React.PropsWithChildren) {
  return (
    // Refine's ThemedLayoutV2 component with a custom Header and Title
    <ThemedLayoutV2 
      Header={Header} // Use the custom Header component
      Title={(titleProps) => (
        // ThemedTitleV2 with custom text and passed props
        <ThemedTitleV2 {...titleProps} text="Refine" />
      )}
    >
      {/* Render the child components passed to the Layout */}
      {children}
    </ThemedLayoutV2>
  );
}

export default Layout; // Export the Layout component
