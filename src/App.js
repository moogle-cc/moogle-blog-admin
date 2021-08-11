import React , {useState , useEffect} from "react";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import config from './config'
import Header from './components/Header';
import Body from './components/Body';
// import BlogPostModal from './components/BlogPostModal';
import "./brand-style.css";
import {convertTime, dateStringInSeconds} from './utils';

//! Checking Login Credentials Starts.
const loginUrl = `https://moogle.cc/account`;
let details = {};
let authDetails = {};

if (localStorage.getItem("userDetails") !== null) {
  const userDetails = localStorage.getItem("userDetails");
  details = JSON.parse(userDetails);
  if (!authTokenIsValid()) {
    console.log("Not Okay");
    localStorage.removeItem("userDetails");
    redirectToLogin();
  }
} else {
  checkParams();
}
function checkParams() {
  let hash = new URL(document.location).hash;
  let loc = hash ? document.location.href.replace(/#/, "?") : document.location;
  let params = new URL(loc).searchParams;
  if (
    params.get("id_token") &&
    params.get("access_token") &&
    params.get("expires_in") &&
    tokenIsValid(params.get("id_token"))
  ) {
    authDetails = {
      id_token: params.get("id_token"),
      access_token: params.get("access_token"),
      expires_in: params.get("expires_in"),
    };
    localStorage.setItem("userDetails", JSON.stringify(authDetails));
    window.history.pushState("", document.title, window.location.pathname);
    if (!authTokenIsValid()) console.log("Not okay"); //redirectToLogin();
  } else {
    redirectToLogin();
  }
}
function tokenIsValid(idToken) {
  try {
    let x = JSON.parse(atob(idToken.split(".")[1]));
    return Date.now() < x.exp * 1000; //converting exp to msec
  } catch (e) {
    console.log(`Error: ${e}`);
  }
  return false;
}
function authTokenIsValid() {
  return (
    (authDetails || details) &&
    tokenIsValid(details.id_token || authDetails.id_token)
  );
}
function redirectToLogin() {
  window.location.href = loginUrl;
}
//! Checking Login Credentials Ends.

let onMobile = () => {
  let el = document.getElementById("mobile-device-only-div");
  return el && window.getComputedStyle(el).display !== "none" ? true:false;
};

const App = () => {
  let [posts , setPosts] = useState(undefined);
  let [constants , setConstants] = useState(undefined);
  let [eventData, setEventData] = useState(undefined);
  let [userIsOnMobile, setUserIsOnMobile] = useState(false);
  let [blogDetailsIsVisible, setIsBlogDetailsVisible] = useState(undefined);
  const loadPosts = () => {
    axios.get(config.POSTS_URL).then((response) => {
      let data = response.data;
      if(data) data.sort((a,b) => a.published_unix_ts > b.published_unix_ts ? -1 : 1);
      setPosts(data);
    })
    .catch(x => console.log(x));
  }

  const loadConstants = () => {
    axios.get(config.CONSTANTS_URL).then(res => {
      setConstants(res.data);
    })
    .catch(x => console.log(x));
  }

  const onUpdatePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    setTimeout(() => {loadPosts()}, 60000);
  };

  const onUpdateConstants = (updatedConstants) => {
    setConstants(updatedConstants);
    setTimeout(() => {loadConstants()}, 60000);
  };

  const onModalStateChanged = (eventData) => {
    setEventData(eventData);
  };

  const onBlogDetailsIsVisibleChanged = (blogDetailsIsVisible) => {
    setIsBlogDetailsVisible(blogDetailsIsVisible);
  };

  useEffect(() => { 
    loadPosts();
    loadConstants();
    setUserIsOnMobile(onMobile());
    setIsBlogDetailsVisible(!userIsOnMobile);
    console.log(`Is user on mobile? ${userIsOnMobile}`);
  },[userIsOnMobile]);

  return (
    <>
      <Header config={config} constants={constants} onModalStateChanged={onModalStateChanged} onBlogDetailsIsVisibleChanged={onBlogDetailsIsVisibleChanged}/>
      <Body config={config} constants={constants} onUpdateConstants={onUpdateConstants} onModalStateChanged={onModalStateChanged} posts={posts} blogDetailsIsVisible={blogDetailsIsVisible} onBlogDetailsIsVisibleChanged={onBlogDetailsIsVisibleChanged} eventData={eventData} details={details} authDetails={authDetails} onUpdatePosts={onUpdatePosts} convertTime={convertTime} dateStringInSeconds={dateStringInSeconds}/>
      <div id='mobile-device-only-div' className='is-hidden-desktop is-hidden-tablet'></div>
    </>
  );
};

export default App;
