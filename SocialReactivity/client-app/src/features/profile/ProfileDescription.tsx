import React, { useContext, useState } from "react";
import { Grid, Tab, Header, Button } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileEditForm from "./ProfileEditForm";
import { observer } from "mobx-react-lite";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { isCurrentUser, profile } = rootStore.profileStore;

  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <ProfileEditForm setEditMode={setEditMode} profile={profile!} />
          ) : (
            <span>{profile?.bio}</span>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
