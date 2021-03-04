import { storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const ProfilePhoto = ({ setPhoto }) => {
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`userProfilePhotos}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    setAttachment("");
    setPhoto(attachmentUrl);
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

  return (
    <form onSubmit={onSubmit}>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {attachment && <img src={attachment} width="50px" height="50px" alt="" />}
      <input type="submit" value="Add Photo" />
    </form>
  );
};

export default ProfilePhoto;
