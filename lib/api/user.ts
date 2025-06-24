import api from "@/lib/api/api";
import {UserDTO} from "@/lib/api/models/dto/User";

export const fetchUsers = async (userIds: string[]) => {
  try {
    const response = await api.post<UserDTO[]>(
      '/users/retrieve-unauthed',
      {userIdentifiers: userIds}
    );
    if (response && response.status === 200) {
      return response.data as UserDTO[];
    }
    return Promise.reject("Unavailable users");
  } catch (error) {
    return Promise.reject(error);
  }
}