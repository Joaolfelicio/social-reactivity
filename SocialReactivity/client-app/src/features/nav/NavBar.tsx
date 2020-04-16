import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
} 

const NavBar : React.FC<IProps> = ({openCreateForm}) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img src="/assets/logo.png" alt="Social Reactivity Logo" style={{marginRight: '10px'}}/>
          Social Reactivity
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
            <Button positive content="Create Activity" onClick={ () => openCreateForm() }/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
