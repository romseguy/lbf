import { Base64Image } from "utils/image";
import { TOKEN_NAME } from "./";

type UserMetadata = {
  email: string;
  userId: string;
  userImage?: Base64Image;
  userName: string;
  isAdmin?: boolean;
};

export type Session = {
  [TOKEN_NAME]?: string | null;
  user: UserMetadata;
};

export const devSession =
  // lilo
  {
    user: {
      email: "rom.seguy@lilo.org",
      userId: "60e340cb56ef290008d2e75d",
      userName: "romain",
      isAdmin: false
    }
  };
// gmail
// {
//   user: {
//     email: "rom.seguy@gmail.com",
//     userId: "61138a879544b000088318ae",
//     userName: "romseguy66"
//   }
// };
null;

export const testSession =
  // admin
  {
    user: {
      email: "rom.seguy@lilo.org",
      userId: "60e340cb56ef290008d2e75d",
      userName: "romain",
      isAdmin: true
    }
  };
// {
//   user: {
//     email: "rom.seguy@gmail.com",
//     userId: "61138a879544b000088318ae",
//     userName: "romseguy66"
//   }
// };
null;
