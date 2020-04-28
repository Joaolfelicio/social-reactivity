import React, { useContext, Fragment } from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";

const Homepage = () => {
  const token = window.localStorage.getItem("jwt");
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  return (
    <Segment
      style={{ display: "flex", justifyContent: "center" }}
      inverted
      textAlign="center"
      vertical
      className="masthead"
    >
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Social Reactivity
        </Header>
        {isLoggedIn && user && token ? (
          <Fragment>
            <Header
              as="h2"
              inverted
              content={`Welcome back ${user.displayName}`}
            />
            <Button
              style={{ marginTop: 20 }}
              as={Link}
              to="/activities"
              size="huge"
              inverted
            >
              Go to activities
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as="h2" inverted content="Welcome to Social Reactivity" />
            <Button
              style={{ marginTop: 20 }}
              onClick={() => openModal(<LoginForm />)}
              to="/login"
              size="huge"
              inverted
            >
              Login
            </Button>
            <Button
              onClick={() => openModal(<RegisterForm />)}
              to="/register"
              size="huge"
              inverted
            >
              Register
            </Button>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default observer(Homepage);
