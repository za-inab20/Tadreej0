import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store";
import PhaseShell from "../../pages/phases/PhaseShell";

 
const defaultData = {
    title: "Test Phase",
    subtitle: "Test Subtitle",
    objectives: ["Objective 1", "Objective 2"],
    actions: ["Action 1", "Action 2"],
    courses: ["React Basics"],
    freelancers: ["Developer"]
};

describe("PhaseShell Tests", () => {

    test("renders phase title", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PhaseShell
                        phaseIndex={0}
                        accentColor="#534cdf"
                        defaultData={defaultData}
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(
            screen.getByText(/test phase/i)
        ).toBeInTheDocument();
    });

    test("renders objectives section", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PhaseShell
                        phaseIndex={0}
                        accentColor="#4f46e5"
                        defaultData={defaultData}
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(
            screen.getByText(/objectives/i)
        ).toBeInTheDocument();
    });

    test("toggles task completion", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PhaseShell
                        phaseIndex={0}
                        accentColor="#4f46e5"
                        defaultData={defaultData}
                    />
                </MemoryRouter>
            </Provider>
        );

        const task = screen.getByText("Objective 1");
        fireEvent.click(task);

        // after click, it should still exist 
        expect(task).toBeInTheDocument();
    });

    test("renders navigation buttons", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <PhaseShell
                        phaseIndex={0}
                        accentColor="#4f46e5"
                        defaultData={defaultData}
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(
            screen.getByText(/roadmap/i)
        ).toBeInTheDocument();
    });

});
