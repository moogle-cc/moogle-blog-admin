import React from 'react';
import BlogPostModal from '../BlogPostModal';
import BlogMetadata from "../BlogMetadata";
import UpgradeModal from "../UpgradeModal";
import Post from '../Post';
import './style.css';
import { ToastContainer } from 'react-toastify';

const Body = ({posts, config, constants, blogDetailsIsVisible, eventData, onUpdateConstants, onModalStateChanged, onBlogDetailsIsVisibleChanged, details, authDetails, onUpdatePosts, convertTime, dateStringInSeconds}) => {
  let showAddUpdateBlogModal = (event, post) => {
    let modalState = 'open';
    let modalId = 'modal';
    onModalStateChanged({modalState, modalId, event, post});
  };

  return(
    <>
      <UpgradeModal config={config} constants={constants} eventData={eventData} onUpdateConstants={onUpdateConstants} onModalStateChanged={onModalStateChanged}/>
      <BlogPostModal posts={posts ? posts : undefined} details={details} authDetails={authDetails} onUpdatePosts={onUpdatePosts} eventData={eventData} convertTime={convertTime} dateStringInSeconds={dateStringInSeconds} onModalStateChanged={onModalStateChanged}/>
      <div className="columns my-5">
        <div className={`column ${blogDetailsIsVisible ? '' : 'is-hidden'} mx-4`}>
          <BlogMetadata blogDetailsIsVisible={blogDetailsIsVisible} config={config} constants={constants} onUpdateConstants={onUpdateConstants} onBlogDetailsIsVisibleChanged={onBlogDetailsIsVisibleChanged} eventData={eventData}/>
        </div>
        <div className="column">
          <section className="postsContainer" id="postsContainer">
            <div className="posts center">
            {
                posts ? 
                posts.map((post , index) => (
                  <Post post={post} postIndex={index} showAddUpdateBlogModal={showAddUpdateBlogModal} onModalStateChanged={onModalStateChanged}/>
                )) : 'Loading.....'
            }
            </div>
            <ToastContainer position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
            />
          </section>
        </div>
      </div>
    </>
  )
}

export default Body;
