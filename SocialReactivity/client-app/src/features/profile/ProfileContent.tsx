import React from "react";
import { Tab } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import ProfileDescription from "./ProfileDescription";
import { observer } from "mobx-react-lite";
import ProfileFollowings from "./ProfileFollowings";
import { useMediaQuery } from "react-responsive";

const panes = [
  { menuItem: "About", render: () => <ProfileDescription /> },
  { menuItem: "Photos", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <Tab.Pane>Activities content</Tab.Pane>,
  },
  {
    menuItem: "Followers",
    render: () => <ProfileFollowings />,
  },
  {
    menuItem: "Following",
    render: () => <ProfileFollowings />,
  },
];

interface IProps {
  setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  const isSmallPhone = useMediaQuery({
    query: "(max-width: 475px)",
  });

  return (
    <Tab
      menu={{
        fluid: true,
        vertical: true,
      }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
      grid={
        !isSmallPhone
          ? { paneWidth: 12, tabWidth: 4 }
          : { paneWidth: 11, tabWidth: 5 }
      }
    />
  );
};

export default observer(ProfileContent);
