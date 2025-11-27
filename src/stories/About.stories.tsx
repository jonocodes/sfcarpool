import type { Meta, StoryObj } from "@storybook/react-vite";
import { About } from "../components/About";
// import { Route as AboutRoute } from "../routes/about.route";

const meta = {
  title: "Routes/About",
  component: About,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
