import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withA11y } from "@storybook/addon-a11y";
import { withTheme } from "../src/components/Storybook/utils";

addDecorator(withTheme);
addDecorator(withA11y);
addDecorator(withKnobs);
