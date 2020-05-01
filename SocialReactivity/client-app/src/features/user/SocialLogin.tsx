import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Button, Icon } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

interface IProps {
  fbCallback: (response: any) => void;
  loading: boolean;
}

const SocialLogin: React.FC<IProps> = ({ fbCallback, loading }) => {
  return (
    <div>
      <FacebookLogin
        appId="3284538174956192"
        fields="name,email,picture"
        callback={fbCallback}
        render={(renderProps: any) => (
          <Button
            onClick={renderProps.onClick}
            type="button"
            fluid
            color="facebook"
            loading={loading}
          >
            <Icon name="facebook" />
            Login with Facebook
          </Button>
        )}
      />
    </div>
  );
};

export default observer(SocialLogin);
