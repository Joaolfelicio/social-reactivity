import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ActivityStore from "../../app/stores/activityStore";
import { observer } from "mobx-react-lite";

const NavBar = () => {
  const activityStore = useContext(ActivityStore);
  const {openCreateForm} = activityStore;

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="Social Reactivity Logo"
            style={{ marginRight: "10px" }}
          />
          Social Reactivity
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            onClick={openCreateForm}
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
