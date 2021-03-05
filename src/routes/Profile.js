import React, { useEffect, useState } from "react";
import { authService, dbService, storageService } from "fbase";
import { useHistory } from "react-router-dom";
import ProfilePhoto from "components/ProfilePhoto";
const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [photoInfo, setPhotoInfo] = useState({});
  const [mounted, setMounted] = useState(false);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  useEffect(() => {
    dbService.collection("userInfos").onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (userObj.uid === doc.data().uid) {
          var newPhotoInfo = {
            docId: doc.id,
            photoUrl: doc.data().photoUrl,
          };

          setPhotoInfo(newPhotoInfo);
        }
      });
    });

    setMounted(true);
  }, [userObj]);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  // 이름변경시 트윗들 displayname 싹 변경(트윗 자체를 user별로 폴더를 만드는게 나을 듯..?)
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      var docId;
      const userInfosRef = await dbService.collection("userInfos").get();
      userInfosRef.docs.forEach((doc) => {
        if (userObj.uid === doc.data().uid) {
          docId = doc.id;
        }
      });
      // display name, profile photo는 실시간 update 적용시키지 x
      // reload시에 변경되도록..!
      await dbService.doc(`userInfos/${docId}`).update({
        displayName: newDisplayName,
      });

      refreshUser();
    }
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this photo?");
    if (ok) {
      // update로 바꾸기
      await dbService.doc(`userInfos/${photoInfo.docId}`).update({
        photoUrl: "",
      });
      await storageService.refFromURL(photoInfo.photoUrl).delete();

      setPhotoInfo({});
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
        {mounted && photoInfo.photoUrl ? (
          <>
            <img src={photoInfo.photoUrl} width="50px" height="50px" alt="" />
            <button onClick={() => onDeleteClick()}>Delete Photo</button>
          </>
        ) : (
          <ProfilePhoto userObj={userObj} setPhotoInfo={setPhotoInfo} />
        )}
      </>
      <button onClick={() => onLogOutClick()}>Log Out</button>
    </>
  );
};

export default Profile;
