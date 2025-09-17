import { userModal } from '../modal/userModal';
import { TCreateUser, TDeleteUser, TGetUser } from '../types/user.types';

export const getUserController = async (): Promise<TGetUser[]> => {
  try {
    const getdata = await userModal.getUserModal();
    return getdata;
  } catch (err) {
    throw new Error('Failed to get the User data');
  }
};
export const createUserController = async (
  email: string,
  username: string,
  password: string
): Promise<TCreateUser> => {
  try {
    if (!username || !email || !password) {
      throw new Error('All filed required to be filled');
    }

    const searchExist = await userModal.searchUser(email, username);
    if (searchExist) {
      throw new Error('User already register');
    }
    const registerUser = await userModal.createUserModal({
      email,
      username,
      password,
    });
    return registerUser;
  } catch (err) {
    throw err;
  }
};
export const deleteUserController = async (
  email: string
): Promise<TDeleteUser> => {
  try {
    console.log('this is the email to delete', email);
    if (!email) {
      return {
        success: true,
        message: 'Failed to deleteUser',
        email: email,
      };
    }
    const searchUser = await userModal.searchUser(email);
    if (!searchUser) {
      return {
        success: false,
        message: 'No user found',
        email,
      };
    }
    const del = await userModal.deleteUserModal(email);

    if (!del) {
      throw new Error('User not found');
    }
    console.log('this is the del', del);
    return {
      success: true,
      message: 'User deleted',
      email: email,
    };
  } catch (err) {
    return {
      success: false,
      message: `failed to delete ${err}`,
      email,
    };
  }
};
export const updateUserController = async (
  email: string,
  username?: string,
  password?: string
) => {
  const update = await userModal.updateUserModal(email, username, password);
  return update;
};
