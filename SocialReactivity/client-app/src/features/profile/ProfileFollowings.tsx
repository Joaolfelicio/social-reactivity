import React, { useContext } from "react";
import { Tab, Grid, Header, Card } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileFollowingsCard from "./ProfileFollowingsCard";
import { observer } from "mobx-react-lite";

const ProfileFollowings = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    followings,
    followingsLoading,
    activeTab
  } = rootStore.profileStore;

  return (
    <Tab.Pane loading={followingsLoading}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === 3
                ? `People following ${profile!.displayName}`
                : `People ${profile!.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followings.map((profile) => (
              <ProfileFollowingsCard key={profile.username} profile={profile} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileFollowings);
