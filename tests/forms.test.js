import { Provider } from "react-redux";
import { Chakra } from "features/common";
import theme from "features/layout/theme";

import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks"
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import React from "react";
//import AddGenericPage from "pages/arbres/ajouter";
import {
  useGetOrgQuery
} from "features/api/orgsApi";
import { EntityAddPage } from "features/common"
import HashPage from "pages/[...name]"
import { EOrgType } from "models/Org";
import { makeStore } from "store";
import { setSession } from "store/sessionSlice";
import { testSession } from "utils/auth"
import { render, wrapper } from "./utils"

let store
const updateTimeout = 5000;

beforeAll(() => {
  fetchMock.mockOnceIf('http://localhost:3004/api/org/cerisier', (req) => {
    return Promise.resolve({
      status: 200,
      body: JSON.stringify({ data: { orgUrl: "cerisiers" } }),
    })
  })
})

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

  it("loads", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useGetOrgQuery({ orgUrl: 'cerisier' }), { wrapper: wrapper(store) })
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });
    expect(fetchMock).toBeCalled();
    const nextResponse = result.current;
    expect(nextResponse.data).not.toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isSuccess).toBe(true);

    useRouter.mockReturnValue({ query: { name: ["cerisier"] }, pathname: "/cerisier", asPath: "/cerisier" });
    render(<HashPage />, { store })

    // const user = userEvent.setup()
    //await screen.findByText =
    // waitFor(() => {
    //   screen.getByText("Merci de patienter...")
    // })
    // waitFor(() => {
    //   screen.getByText("Cerisier")
    // })

    // await waitFor(() => {
    //   const btn = screen.getByRole("button", { name: /configurer/i })
    //   user.click(btn)
    // })
  })
})
