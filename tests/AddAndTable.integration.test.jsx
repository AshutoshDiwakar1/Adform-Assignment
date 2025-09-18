// tests/AddAndTable.integration.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "../src/App";
import { Provider } from "react-redux";
import { store } from "../src/store";

jest.mock("axios");

const fakeUsers = [{ id: 1, name: "Leanne Graham" }];

describe("Add campaign integration (Jest)", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: fakeUsers });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("opens modal, submits form and shows new campaign in table", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    const addButton = await screen.findByRole("button", { name: /Add Campaign/i });
    await userEvent.click(addButton);
    const dialog = await screen.findByRole("dialog");
    const dialogUtils = within(dialog);

    // select inputs inside the dialog unambiguously
    const idInput = dialogUtils.getByRole("textbox", { name: /^ID$/i });
    const nameInput = dialogUtils.getByRole("textbox", { name: /Name/i });
    const startInput = dialogUtils.getByLabelText(/Start date/i);
    const endInput = dialogUtils.getByLabelText(/End date/i);
    const budgetInput = dialogUtils.getByRole("textbox", { name: /Budget/i });

    // fill fields
    await userEvent.type(idInput, "777");
    await userEvent.type(nameInput, "Jest Test Campaign");

    // use fireEvent.change for date inputs (more reliable in jsdom)
    fireEvent.change(startInput, { target: { value: "2025-01-01" } });
    fireEvent.change(endInput, { target: { value: "2025-12-31" } });

    await userEvent.type(budgetInput, "5000");

    // submit the modal form by clicking the Add button inside dialog
    const modalAdd = dialogUtils.getByRole("button", { name: /^Add$/i });
    await userEvent.click(modalAdd);

    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // assert added to table
    await waitFor(() => {
      expect(screen.getByText(/Jest Test Campaign/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/\$5,000/)).toBeInTheDocument();
  }, 10000);
});
