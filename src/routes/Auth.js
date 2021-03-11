import React from "react";
import { authService, dbService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    const data = await authService.signInWithPopup(provider);
    // provider로 로그인 시 이미 등록된 유저인지 확인해주어야 함 -> userInfos collection 가져와서 체크
    var newInfo;
    var isNew = true;
    const getRef = await dbService.collection("userInfos").get();
    getRef.docs.forEach((doc) => {
      // 등록된 user
      if (doc.data().uid === data.user.uid) {
        isNew = false;
      }
    });

    //새로운 user의 경우 -> userInfos collection에 정보 추가하기
    if (isNew) {
      newInfo = {
        uid: data.user.uid,
        photoUrl: "",
        // 처음에는 null로 설정됨
        displayName: "not set",
      };

      await dbService.collection("userInfos").add(newInfo);
    }
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
