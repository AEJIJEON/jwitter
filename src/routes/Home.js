import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import "components/home.css";
const onLogOutClick = async () => {
  await authService.signOut();
};
const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    //userInfos도 가져옴
    var infoArray;
    dbService.collection("userInfos").onSnapshot((snapshot) => {
      infoArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
    });

    dbService.collection("nweets").onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // nweet와 info uid와 creator id가 같은 경우에 대해서
      // nweet에 추가 정보 더 더해줌
      for (var i = 0; i < nweetArray.length; i++) {
        for (var j = 0; j < infoArray.length; j++) {
          if (nweetArray[i].creatorId === infoArray[j].uid) {
            nweetArray[i].displayName = infoArray[j].displayName;
            nweetArray[i].photoUrl = infoArray[j].photoUrl;
          }
        }
      }
      // js sort() 이용해서 시간 느린 순으로 정렬(더 효율적인 방법이 있을텐데.. 일단 보류)
      nweetArray.sort(function (a, b) {
        return parseInt(b.createdAt) - parseInt(a.createdAt);
      });
      setNweets(nweetArray);
    });
  }, []);
  return (
    <>
      <div className="logoutAndNweetForm">
        <button onClick={() => onLogOutClick()}>Log Out</button>
        <NweetFactory userObj={userObj} />
      </div>
      <div className="nweetsContainer">
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};
export default Home;
