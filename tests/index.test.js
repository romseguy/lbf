import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import React from "react";
import IndexPage from "pages/index";
import { makeStore } from "store";
import { setSession } from "store/sessionSlice";
import { testSession } from "utils/auth"
import { render } from "./utils"


beforeEach(() => {
  const store = makeStore()
  store.dispatch(setSession(testSession))
  render(<IndexPage />, { store });
})

describe("IndexPage", () => {
  it("displays session info", async () => {
    expect(screen.getByRole('button', { name: "Nom de l'arbre" })).toBeInTheDocument()
    screen.getByLabelText(testSession.user.userName)
    screen.getByText(testSession.user.email)
  });

  it("can navigate to OrgForm and EventForm", async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Mes planètes/i }))
    await user.click(screen.getByRole('button', { name: /Ajouter une planète/i }))
    expect(useRouter().push).toBeCalledWith("/planetes/ajouter", "/planetes/ajouter", { shallow: true })

    await user.click(screen.getByRole('button', { name: /Mes arbres/i }))
    await user.click(screen.getByRole('button', { name: /Ajouter un arbre/i }))
    expect(useRouter().push).toBeCalledWith("/arbres/ajouter", "/arbres/ajouter", { shallow: true })

    await user.click(screen.getByRole('button', { name: /Mes événements/i }))
    await user.click(screen.getByRole('button', { name: /Ajouter un événement/i }))
    expect(useRouter().push).toBeCalledWith("/evenements/ajouter", "/evenements/ajouter", { shallow: true })
  })
});
