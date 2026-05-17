import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store";
import Profile from "../../pages/Profile";
describe("Profile Page Tests", () => {
  test("renders profile title", () => {
    render(
      <Provider store={store}>
        {" "}
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Profile />
        </MemoryRouter>{" "}
      </Provider>,
    );
    expect(screen.getByText(/my profile/i)).toBeInTheDocument();
  });
  test("settings tab opens", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Profile />{" "}
        </MemoryRouter>
      </Provider>,
    );
    const settingsBtn = screen.getByText(/settings/i);
    fireEvent.click(settingsBtn);
    expect(screen.getByText(/security/i)).toBeInTheDocument();
  });

  test("current password input works", () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Profile />{" "}
        </MemoryRouter>{" "}
      </Provider>,
    );
    fireEvent.click(screen.getByText(/settings/i));
    const passwordInput = screen.getByPlaceholderText(
      /enter current password/i,
    );

    fireEvent.change(passwordInput, { target: { value: "123456" } });
    expect(passwordInput.value).toBe("123456");
  });
});
