import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import LocationsCell from "../components/LocationsCell";
// Import the mocked triplit client (aliased in .storybook/main.ts)
import { triplit } from "../../triplit/client";

// Define Props type for better type safety with Storybook
type LocationsCellProps = React.ComponentProps<typeof LocationsCell>;

const meta: Meta<LocationsCellProps> = {
  title: "Components/LocationsCell",
  component: LocationsCell,
  //   tags: ["autodocs"],
  argTypes: { locationId: { control: "number" }, week: { control: "text" } },
  parameters: {
    layout: "centered",
    // No moduleMock parameter needed here anymore
  },
  // beforeEach could also go here to apply to all stories if the mock setup is general
};

export default meta;
type Story = StoryObj<LocationsCellProps>;

const mockLocationsData = [
  { id: "1", name: "Berkeley -> SF (Mocked by Alias)" },
  { id: "2", name: "Oakland -> SF (Mocked by Alias)" },
  { id: "3", name: "Orinda -> SF (Mocked by Alias)" },
];

export const Default: Story = {
  args: { locationId: "1", week: "2024-W28" },
  beforeEach: async () => {
    // Set mock data using the triplit mock's helper method
    (triplit as any).__setMockData(mockLocationsData);
  },
};

export const Loading: Story = {
  args: { locationId: "1", week: "2024-W28" },
  beforeEach: async () => {
    // Note: The current component doesn't show loading state with Triplit
    // This story shows what happens when data is being fetched
    (triplit as any).__setMockData([]);
  },
};

export const Empty: Story = {
  args: { locationId: "1", week: "2024-W28" },
  beforeEach: async () => {
    (triplit as any).__setMockData([]);
  },
};

// Example of how to test onChange if needed, though it currently only logs
// export const WithOnChangeAction: Story = {
//   args: {
//     locationId: 2,
//     week: '2024-W29',
//   },
//   render: (args) => {
//     useShape.mockReturnValue({
//       data: mockLocationsData,
//       isLoading: false,
//       error: null,
//     });
//     // If you want to test the onChange, you'd typically pass a Storybook action
//     // For now, LocationsCell just console.logs
//     // We can spy on console.log if necessary, or modify the component to accept an onChange prop
//     return <LocationsCell {...args} />;
//   },
// };

// To use Storybook actions for the onChange if you decide to pass it as a prop:
// 1. Add `onLocationChange: { action: 'locationChanged' }` to argTypes in meta
// 2. Update LocationsCell to accept and call `onLocationChange`
// 3. In the story: `args: { ...ExistingArgs, onLocationChange: fn() }`
