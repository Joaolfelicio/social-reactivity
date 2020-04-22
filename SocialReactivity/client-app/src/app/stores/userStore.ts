import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import api from "../api/api";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await api.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await api.User.register(values);
      runInAction(() => {
        this.rootStore.commonStore.setToken(user.token);
        this.rootStore.modalStore.closeModal();
      });
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action getUser = async () => {
    try {
      const user = await api.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  @computed get isLoggedIn() {
    return !!this.user;
  }
}
