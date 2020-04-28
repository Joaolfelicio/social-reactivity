import { RootStore } from "./rootStore";
import { IProfile, IPhoto, IUserActivity } from "../models/profile";
import { observable, action, runInAction, computed, reaction } from "mobx";
import api from "../api/api";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable deleteLoading = false;
  @observable editLoading = false;
  @observable followLoading = false;
  @observable followingsLoading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingActivities = false;

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const activities = await api.Profile.listActivities(username, predicate!);
      runInAction(() => {
        this.userActivities = activities;
        this.loadingActivities = false;
      });
    } catch (error) {
      toast.error("Problem loading activities");
      runInAction(() => {
        this.loadingActivities = false;
      });
    }
  };

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

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
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
    this.deleteLoading = true;
    try {
      await api.Profile.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((x) => x.isMain)!.isMain = false;
        this.profile!.photos.find((x) => x.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.deleteLoading = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.deleteLoading = true;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.deleteLoading = true;
    try {
      await api.Profile.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (x) => x.id !== photo.id
        );
        this.deleteLoading = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.deleteLoading = true;
      });
    }
  };

  @action editProfile = async (profile: Partial<IProfile>) => {
    try {
      this.editLoading = true;
      await api.Profile.edit(profile);
      runInAction("edit profile", () => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
        this.editLoading = false;
      });
    } catch (error) {
      toast.error("Problem editing the profile");
      this.editLoading = false;
    }
  };

  @action follow = async (username: string) => {
    this.followLoading = true;
    try {
      await api.Profile.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.followLoading = false;
      });
    } catch (error) {
      toast.error("Problem following user");
      runInAction(() => {
        this.followLoading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.followLoading = true;
    try {
      await api.Profile.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.followLoading = false;
      });
    } catch (error) {
      toast.error("Problem unfollowing user");
      runInAction(() => {
        this.followLoading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.followingsLoading = true;
    try {
      const profiles = await api.Profile.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.followingsLoading = false;
      });
    } catch (error) {
      toast.error("Problem loading followings");
      runInAction(() => {
        this.followingsLoading = false;
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
