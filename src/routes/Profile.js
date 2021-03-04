import React, {  useEffect, useState } from "react";
import { authService, dbService, storageService } from "fbase";
import { useHistory } from "react-router-dom";
import ProfilePhoto from "components/ProfilePhoto";
const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [photoInfo, setPhotoInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
    useEffect(() => {
      dbService.collection("userPhotos").onSnapshot((snapshot) => {
      
        snapshot.docs.forEach((doc) => {
          let newPhotoInfo;
          if (userObj.uid === doc.data().uid){
            newPhotoInfo = {
              id: doc.id,
              photoUrl: doc.data().photoUrl
            }
            setPhotoInfo(newPhotoInfo);
          }}
        );
      });
      setMounted(true);
    }, [userObj]);





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
  const onDeleteClick = async () => {

    const ok = window.confirm("Are you sure you want to delete this photo?");
    if (ok) {
        await dbService.doc(`userPhotos/${photoInfo.id}`).delete();
        await storageService.refFromURL(photoInfo.photoUrl).delete();
        
        setPhotoInfo(null);
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
        {mounted && photoInfo ?
        <>
        <img src={photoInfo.photoUrl} width="50px" height="50px" alt="" />
        <button onClick = {() => onDeleteClick()}>Delete Photo</button>
        </>
        : <ProfilePhoto userObj = {userObj} setPhotoInfo={setPhotoInfo} />}
      </>
      <button onClick={() => onLogOutClick()}>Log Out</button>
    </>
  );
};

export default Profile;
