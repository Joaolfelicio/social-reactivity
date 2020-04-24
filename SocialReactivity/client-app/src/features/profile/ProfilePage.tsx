import React, { useEffect, useContext } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface DetailParams{
  username: string
}

const ProfilePage: React.FC<RouteComponentProps<DetailParams>> = ({match}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadProfile, loadingProfile, profile} = rootStore.profileStore;
 
  useEffect(() => {
    loadProfile(match.params.username);
  }, [match.params.username, loadProfile]);

  if(loadingProfile) return <LoadingComponent content="Loading profile..." />

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
