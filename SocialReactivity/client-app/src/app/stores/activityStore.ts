import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../layout/models/activity";
import api from "../api/api";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  @observable selectedActivity: IActivity | undefined;
  @observable editMode = false;
  @observable submitting = false;
  @observable deleteTarget = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;

    try {
      const activities = await api.Activities.list();
      runInAction("Loading Activities", () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Load Activities Finally", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await api.Activities.create(activity);
      runInAction("Creating Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Creating Activity Finally", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await api.Activities.update(activity);
      runInAction("Editing Activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Editing Activity Finally", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.deleteTarget = event.currentTarget.name;

    try {
      await api.Activities.delete(id);
      runInAction("Deleting Activity", () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("Deleting Activity Finally", () => {
        this.submitting = false;
        this.deleteTarget = "";
      });
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
