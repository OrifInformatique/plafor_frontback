import { MemoryRouter } from "react-router-dom";
import Login from "./index";

export default {
    title: "Components/UI/Auth/Login",
    component: Login,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
}

export const Default = {}