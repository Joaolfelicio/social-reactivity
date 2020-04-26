import React, { FC } from "react";
import {
  Segment,
  Item,
  Header,
  Button,
  Grid,
  Statistic,
  Divider,
  Reveal,
} from "semantic-ui-react";
import { IProfile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { useMediaQuery } from "react-responsive";

interface IProps {
  profile: IProfile;
  isCurrentUser: boolean;
  followLoading: boolean;
  follow: (username: string) => void;
  unfollow: (username: string) => void;
}

const ProfileHeader: React.FC<IProps> = ({
  profile,
  isCurrentUser,
  followLoading,
  follow,
  unfollow,
}) => {
  const isSmallPhone = useMediaQuery({
    query: "(max-width: 500px)",
  });

  const isButtonPhone = useMediaQuery({
    query: "(max-width: 672px)",
  });

  const followingSizeStyle = {
    fontSize: 11,
  };

  return (
    <Segment>
      <Grid>
        <Grid.Column width={11}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile.image || "/assets/user.png"}
              />
              <Item.Content verticalAlign="middle">
                <Header as="h1">{profile.displayName}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column verticalAlign="middle" width={5}>
          <Statistic.Group widths={2}>
            <Statistic
              style={isSmallPhone ? followingSizeStyle : null}
              horizontal={isButtonPhone}
              label="Followers"
              value={profile.followersCount}
            />
            <Statistic
              style={isSmallPhone ? followingSizeStyle : null}
              horizontal={isButtonPhone}
              label="Following"
              value={profile.followingCount}
            />
          </Statistic.Group>
          <Divider />

          {!isCurrentUser && (
            <Reveal animated="move">
              <Reveal.Content visible style={{ width: "100%" }}>
                <Button
                  size={isSmallPhone ? "mini" : "medium"}
                  fluid
                  color="teal"
                  content={profile.following ? "Following" : "Not following"}
                />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Button
                  size={isSmallPhone ? "mini" : "medium"}
                  loading={followLoading}
                  fluid
                  basic
                  color={profile.following ? "red" : "green"}
                  content={profile.following ? "Unfollow" : "Follow"}
                  onClick={
                    profile.following
                      ? () => unfollow(profile.username)
                      : () => follow(profile.username)
                  }
                />
              </Reveal.Content>
            </Reveal>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
