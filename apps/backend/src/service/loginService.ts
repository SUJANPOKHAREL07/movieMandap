import { loginModal } from '../modal/loginModal';
import { userModal } from '../modal/userModal';
import { TLogin } from '../types/login.types';

async function loginUser(data: TLogin, req: any) {
  const email = data.email;
  const searchUser = await userModal.searchUserEmail({ email });
  if (searchUser === null) {
    return { success: false, message: 'SignUp first' };
  }
  const checkUser = await loginModal.checkLoginCred(data);
  if (!checkUser) {
    return { success: false, message: "Email or Password didn't match" };
  }
  return;
}
export const loginService = { loginUser };
