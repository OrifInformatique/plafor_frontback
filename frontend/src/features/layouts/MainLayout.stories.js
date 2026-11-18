import { MemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import "../../i18n";

export default {
    title: "Components/Layout",
    component: MainLayout,
    tags: ["autodocs"],
    layout: "fullscreen",
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={["/"]}>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export const Layout = {}