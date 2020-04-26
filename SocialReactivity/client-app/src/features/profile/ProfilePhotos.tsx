import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { PhotoUploadWidget } from "../../app/common/photoUpload/PhotoUploadWidget";
import { observer } from "mobx-react-lite";
import { useMediaQuery } from "react-responsive";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    deleteLoading: loading,
    deletePhoto,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };
  
  const isTablet = useMediaQuery({
    query: "(max-width: 992px)",
  });
  const isPhone = useMediaQuery({
    query: "(max-width: 645px)",
  });

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={isTablet ? 3 : 5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group vertical={isPhone} fluid widths={2}>
                        <Button
                          name={photo.id}
                          loading={loading && target === photo.id}
                          onClick={(event) => {
                            setMainPhoto(photo);
                            setTarget(event.currentTarget.name);
                          }}
                          basic
                          positive
                          style={{display: "flex", justifyContent: "center"}}
                          content="Main"
                          disabled={photo.isMain}
                        />
                        <Button
                          name={photo.id}
                          onClick={(event) => {
                            deletePhoto(photo);
                            setDeleteTarget(event.currentTarget.name);
                          }}
                          style={{display: "flex", justifyContent: "center"}}
                          loading={loading && deleteTarget === photo.id}
                          basic
                          negative
                          icon="trash"
                          disabled={photo.isMain}
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
