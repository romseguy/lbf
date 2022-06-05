import React, { useContext, Fragment } from "react";
import { SessionContext } from "lib/SessionContext";

const Profile = () => {
  //@ts-expect-error
  const [user] = useContext(SessionContext);
  console.log(user);

  return (
    <Fragment>
      {user?.loading ? (
        <span>loading</span>
      ) : (
        user?.issuer && (
          <>
            <div className="label">Email</div>
            <div className="profile-info">{user.email}</div>

            <div className="label">User Id</div>
            <div className="profile-info">{user.issuer}</div>
          </>
        )
      )}
      <style jsx>{`
        .label {
          font-size: 12px;
          color: #6851ff;
          margin: 30px 0 5px;
        }
        .profile-info {
          font-size: 17px;
          word-wrap: break-word;
        }
      `}</style>
    </Fragment>
  );
};

export default Profile;
