import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import React from "react";
//import AddGenericPage from "pages/arbres/ajouter";
import { EntityAddPage } from "features/common"
import HashPage from "pages/[...name]"
import { EOrgType } from "models/Org";
import { makeStore } from "store";
import { setSession } from "store/sessionSlice";
import { testSession } from "utils/auth"
import { render } from "./utils"

let store

beforeEach(() => {
  //useRouter.mockClear();
  store = makeStore()
  store.dispatch(setSession(testSession))
})

describe("OrgForm.orgType.GENERIC", () => {
  it("creates", async () => {
    const user = userEvent.setup()
    //const { container } = render(<AddGenericPage />, { store });
    const { container } = render(<EntityAddPage orgType={EOrgType.GENERIC} />, { store });

    //const orgNameInput = container.querySelector('input[name="orgName"]')
    const orgNameInput = screen.getByRole("textbox", { name: "Nom de l'arbre" })
    await user.type(orgNameInput, "cerisier")
    expect(orgNameInput).toHaveValue("cerisier")

    fireEvent.submit(container.querySelector('form'))
  })

  it.only("loads", async () => {
    const user = userEvent.setup()
    useRouter.mockReturnValue({ query: { name: ["cerisier"] }, pathname: "/cerisier", asPath: "/cerisier" });
    render(<HashPage />, { store })

    //await screen.findByText = 
    // waitFor(() => {
    //   screen.getByText("Merci de patienter...")
    // })
    // waitFor(() => {
    //   screen.getByText("Cerisier")
    // })

    await screen.findByRole('button', { name: /.*Configurer.*/ })
    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /configurer/i })
      user.click(btn)
    })
  })
})