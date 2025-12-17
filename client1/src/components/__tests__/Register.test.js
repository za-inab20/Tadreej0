import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store";
import Register from "../Register";

describe("Register Page Tests", () => {

  test("renders register title", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>
    );

    // نتحقق من وجود عنوان Register
    expect(
      screen.getByRole("heading", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("username input works", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </Provider>
    );

    // نبحث عن حقل الاسم حسب الـ placeholder الحقيقي
    const usernameInput = screen.getByPlaceholderText(/enter your name/i);

    fireEvent.change(usernameInput, {
      target: { value: "Zainab" }
    });

    expect(usernameInput.value).toBe("Zainab");
  });

});
