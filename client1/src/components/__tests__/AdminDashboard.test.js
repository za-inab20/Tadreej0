import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store";
import AdminDashboard from "../../pages/AdminDashboard";
import { UserAuthProvider } from "../../context/UserAuthContext";

describe("Admin Dashboard Integration Tests", () => {

  test("loads admin dashboard (real backend)", async () => {

    render(
      <Provider store={store}>
        <UserAuthProvider>
          <MemoryRouter>
            <AdminDashboard />
          </MemoryRouter>
        </UserAuthProvider>
      </Provider>
    );

    expect(
      await screen.findByText(/admin dashboard/i)
    ).toBeInTheDocument();
  });

});