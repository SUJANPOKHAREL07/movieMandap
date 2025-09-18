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
    const searchNameExist = await userModal.searchUserName({ username });
    const searchEmailExist = await userModal.searchUserEmail({ email });

    if (searchNameExist !== null || searchEmailExist !== null) {
      throw new Error('User already register:');
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
    if (!email) {
      return {
        success: false,
        message: 'Failed to deleteUser',
        email: email,
      };
    }
    const searchUser = await userModal.searchUserEmail({ email });
    console.log('Search user result:', searchUser);
    if (searchUser === null) {
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
  console.log('lenght of the usernmae:', username?.length);
  if (username !== undefined) {
    console.log('Inside the update user if ');
    const searchNameExist = await userModal.searchUserName({ username });

    if (searchNameExist !== null) {
      throw new Error('User name exist:');
    }
  }
  const update = await userModal.updateUserModal(email, username, password);
  console.log('update user:', update);
  return update;
};
