import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
const onLogOutClick = () => {
  authService.signOut();
};
const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  
  useEffect(() => {
     dbService.collection("nweets").onSnapshot((snapshot) => {
      
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // js sort() 이용해서 시간 느린 순으로 정렬(더 효율적인 방법이 있을텐데.. 일단 보류)
      nweetArray.sort(function(a, b)  {
        return parseInt(b.createdAt) - parseInt(a.createdAt);
      });
      console.log(nweetArray);
      setNweets(nweetArray);
    });
  }, []);

  return (
    <>
    <button onClick={() => onLogOutClick()}>Log Out</button>
    <div>
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
    </>
  );
};
export default Home;
