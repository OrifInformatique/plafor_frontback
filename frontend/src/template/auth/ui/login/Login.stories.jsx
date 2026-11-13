import { MemoryRouter } from "react-router-dom";
import Login from "./index";
import "../../../../i18n";

export default {
    title: "Components/UI/Auth/Login",
    component: Login,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={["/login"]}>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export const Default = {}