import type { Meta, StoryObj } from "@storybook/react";
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

export const about = () => {
  return <About />;
};

// export default {
//   title: "Pages/About",
//   component: About,
//   parameters: {
//     layout: "fullscreen",
//   },
// };
