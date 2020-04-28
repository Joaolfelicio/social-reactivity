import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combinedDateAndTime = (date: Date, time: Date) => {
  const dateString = date.toISOString().split("T")[0];
  const timeString = time.toISOString().split("T")[1];

  return new Date(dateString + "T" + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);

  activity.isGoing = activity.attendees.some(
    (attendee) => attendee.username === user.username
  );

  activity.isHost = activity.attendees.some(
    (attendee) => attendee.username === user.username && attendee.isHost
  );
  
  return activity;
};

export const createAttendee = (user: IUser) : IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!
  }
}
