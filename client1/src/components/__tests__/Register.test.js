import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../pages/Register";

describe("Register Page Tests", () => {
  test("renders register title", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  test("username input works", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const usernameInput = screen.getByPlaceholderText(/Enter your username/i);
    fireEvent.change(usernameInput, { target: { value: "Zainab" } });
    expect(usernameInput.value).toBe("Zainab");
  });
});
