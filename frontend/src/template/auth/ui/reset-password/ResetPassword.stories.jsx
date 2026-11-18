import { MemoryRouter } from "react-router-dom";
import ResetPassword from "./index";
import "../../../../i18n";

export default {
    title: "Components/UI/Auth/ResetPassword",
    component: ResetPassword,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={["/reset-password"]}>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export const Default = {}