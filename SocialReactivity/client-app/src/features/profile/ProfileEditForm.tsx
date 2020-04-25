import React, { useContext } from "react";
import { IProfile } from "../../app/models/profile";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button } from "semantic-ui-react";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import TextInput from "../../app/common/form/TextInput";
import { combineValidators, isRequired } from "revalidate";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../app/stores/rootStore";

interface IProps {
  profile: IProfile;
  setEditMode: (editMode: boolean) => void;
}

const validate = combineValidators({
  displayName: isRequired({ message: "The display name is required" }),
});

const ProfileEditForm: React.FC<IProps> = ({ profile, setEditMode }) => {
  const rootStore = useContext(RootStoreContext);
  const { editProfile, editLoading } = rootStore.profileStore;

  const handEditProfile = (profile: Partial<IProfile>) => {
    editProfile(profile).then(() => setEditMode(false));
  };

  return (
    <FinalForm
      onSubmit={handEditProfile}
      validate={validate}
      initialValues={profile!}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            placeholder="Display Name"
            value={profile!.displayName}
            name="displayName"
            component={TextInput}
          />
          <Field
            placeholder="Biography"
            value={profile!.bio}
            name="bio"
            component={TextAreaInput}
            rows={3}
          />
          <Button
            loading={editLoading}
            disabled={invalid || pristine}
            floated="right"
            positive
            type="submit"
            content="Update profile"
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
