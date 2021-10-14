import { Button } from "@chakra-ui/react";
import { selectSession, setSession } from "features/session/sessionSlice";
import { useEditUserMutation } from "features/users/usersApi";
import { useSession } from "hooks/useAuth";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const reload = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

const Sandbox: React.FC = () => {
  const { data: session, loading: isSessionLoading } = useSession();
  const dispatch = useDispatch();
  const appSession = useSelector(selectSession);
  console.log(isSessionLoading);
  console.log("s", session?.user.userName);
  console.log("a", appSession?.user.userName);

  const [editUser, editUserMutation] = useEditUserMutation();

  return (
    <>
      <Button
        onClick={async () => {
          await editUser({
            payload: {
              userName:
                session?.user.userName === "romseguy" ? "romseguyz" : "romseguy"
            },
            userName: session?.user.userId
          }).unwrap();
          dispatch(setSession(null));
        }}
      >
        Changer
      </Button>
      <br />
      <br />
      <Button
        onClick={() => {
          dispatch(setSession(null));
        }}
      >
        Null
      </Button>
      <br />
      <br />
      <Button onClick={reload}>Reload</Button>
    </>
  );
};

export default Sandbox;
