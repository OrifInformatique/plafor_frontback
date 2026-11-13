import { MemoryRouter } from "react-router-dom";
import ChangePassowrd from "./index";
import "../../../../i18n";

export default {
    title: "Components/UI/Auth/ChangePassword",
    component: ChangePassowrd,
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={["/change-password"]}>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export const Default = {}