import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import LocationsCell from "../components/LocationsCell";
// import { NotFound } from "../components/NotFound";

// import { Page } from './Page';

const meta = {
  title: "Example/LocationsCell",
  component: LocationsCell,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof LocationsCell>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on component testing: https://storybook.js.org/docs/writing-tests/component-testing
export const Orinda: Story = {
  args: {
    locationId: 3,
    week: "2025-05-15",
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const loginButton = canvas.getByRole("button", { name: /Log in/i });
  //   await expect(loginButton).toBeInTheDocument();
  //   await userEvent.click(loginButton);
  //   await expect(loginButton).not.toBeInTheDocument();

  //   const logoutButton = canvas.getByRole("button", { name: /Log out/i });
  //   await expect(logoutButton).toBeInTheDocument();
  // },
};
