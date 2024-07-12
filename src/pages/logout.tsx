import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "store";
import { setSession } from "store/sessionSlice";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";

const LogoutPage = ({}: {}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      dispatch(resetUserEmail());
      await magic.user.logout();
      await api.get("logout");
      dispatch(setSession(null));
      router.push("/", "/", { shallow: false });
    })();
  }, []);

  return <Spinner />;
};

export default LogoutPage;
