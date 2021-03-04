import React, { useState } from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";
import ProfilePhoto from "components/ProfilePhoto";
const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [photo, setPhoto] = useState("");
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        ></input>

        <input type="submit" value="Update Profile" />
      </form>
      <>
        <ProfilePhoto setPhoto={setPhoto} />
        {photo && <img src={photo} width="50px" height="50px" alt="" />}
        <button onClick={onLogOutClick}>Log Out</button>
      </>
    </>
  );
};

export default Profile;
