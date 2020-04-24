import { RootStore } from "./rootStore";
import { IProfile, IPhoto } from "../models/profile";
import { observable, action, runInAction, computed } from "mobx";
import api from "../api/api";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await api.Profile.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await api.Profile.upload(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await api.Profile.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((x) => x.isMain)!.isMain = false;
        this.profile!.photos.find((x) => x.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.loading = true;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await api.Profile.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (x) => x.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.loading = true;
      });
    }
  };

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }
}
