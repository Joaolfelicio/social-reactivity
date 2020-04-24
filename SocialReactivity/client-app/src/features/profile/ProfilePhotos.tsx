import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { PhotoUploadWidget } from "../../app/common/photoUpload/PhotoUploadWidget";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    loading,
    deletePhoto,
  } = rootStore.profileStore;
  const [AddPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={AddPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!AddPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {AddPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          loading={loading && target === photo.id}
                          onClick={(event) => {
                            setMainPhoto(photo);
                            setTarget(event.currentTarget.name);
                          }}
                          basic
                          positive
                          content="Main"
                          disabled={photo.isMain}
                        />
                        <Button
                          name={photo.id}
                          onClick={(event) => {
                            deletePhoto(photo);
                            setDeleteTarget(event.currentTarget.name);
                          }}
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
