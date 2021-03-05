import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const ProfilePhoto = ({ userObj, setPhotoInfo }) => {
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`userProfilePhotos/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

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
      photoUrl: attachmentUrl,
    });
    const newPhotoInfo = {
      docId: docId,
      photoUrl: attachmentUrl,
    };
    setAttachment("");
    setPhotoInfo(newPhotoInfo);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const clearPhoto = () => setAttachment("");
  return (
    <form onSubmit={onSubmit}>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {attachment && (
        <>
          <img src={attachment} width="50px" height="50px" alt="" />
          <button onClick={clearPhoto}>Clear</button>
        </>
      )}
      <input type="submit" value="Add Photo" />
    </form>
  );
};

export default ProfilePhoto;
