import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import "components/nweet.css";
const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      if (nweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(nweetObj.attachmentUrl).delete();
      }
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
    // 글 내용 편집하다가 캔슬한 경우(text 바뀐 상태로)
    if (newNweet !== nweetObj.text) {
      setNewNweet(nweetObj.text);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    // 사진 edit하는 기능은 x(삭제, 변경 x), text만 update 가능
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <div className="nweetContainer">
          <div className="nweet-user-infos">
            <h5 className="nweet-user-name">name: {nweetObj.displayName}</h5>

            {nweetObj.photoUrl && (
              <img
                src={nweetObj.photoUrl}
                className="nweet-user-photo"
                alt=""
              />
            )}
          </div>
          <div className="nweet-infos">
            {nweetObj.attachmentUrl && (
              <img
                className="nweet-photo"
                src={nweetObj.attachmentUrl}
                alt=""
              />
            )}
            <h4 className="nweet-text">content: {nweetObj.text}</h4>
            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Nweet;
