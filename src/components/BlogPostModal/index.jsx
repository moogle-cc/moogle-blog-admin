import React , {useState , useEffect} from "react";
import axios from 'axios';
import {toast} from 'react-toastify';
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {dateDiff} from '../../utils';

const BlogPostModal = ({posts, details, authDetails, onUpdatePosts, eventData, convertTime, dateStringInSeconds, onModalStateChanged}) => {
  const ADD_TITLE = 'Add post details', UPDATE_TITLE = 'Update post details';
  const TOAST_MISSING_FIELDS = 'Please fill all required fields.';
  const [currentPost, setCurrentPost] = useState({
    filepath: "",
    post_title: "",
    post_excerpt: "",
    author: "",
    published_unix_ts: "",
    status: "",
    tags: ""
  });
  useEffect(() => {
    setCurrentPost({
      filepath: "",
      post_title: "",
      post_excerpt: "",
      author: "",
      published_unix_ts: "",
      status: "",
      tags: ""
    });
    if(eventData && eventData.post) setCurrentPost(JSON.parse(JSON.stringify(eventData.post)));
  }, [eventData]);

  const [updatingBlogIndex, setUpdatingBlogIndex] = useState(false);

  const handleChange = (e) => {
    let {name, value} = e.target;
    console.log(`Handling change: ${name} = ${value}`);
    if(name === 'published_unix_ts') value = dateStringInSeconds(value);
    setCurrentPost({...currentPost, [name]:value});
  }

  const requiredFieldsAreFilled = () => {
    const filepath = document.querySelector("#filepath");
    const post_title = document.querySelector("#post_title");
    const post_excerpt = document.querySelector("#post_excerpt");
    const author = document.querySelector("#author");
    return filepath.value !== '' && post_title.value !== '' && post_excerpt.value !== '' && author.value !== '';
  };

  const verifyData = () => {
    const addOrUpdateBtn = document.querySelector("#addOrUpdateBtn");
    
    if(!requiredFieldsAreFilled()){
      toast(TOAST_MISSING_FIELDS);
      return;
    } 
    let published_unix_ts = document.querySelector("#published_unix_ts");
    if(published_unix_ts.value === '') {
      published_unix_ts.value = convertTime(Date.now());
    }
    addOrUpdateBtn.disabled = false;
    updateBlogIndex();
  }

  const updateBlogIndex = () => {
    let currData = posts ? posts : undefined;
    let fileId, updatedDate;
    fileId = document.querySelector("#filepath").value;
    updatedDate = dateStringInSeconds(document.querySelector("#published_unix_ts").value); //convert this to seconds;
    if(requiredFieldsAreFilled()){
      let postData = {
        filepath: fileId,
        post_title: document.querySelector("#post_title").value,
        post_excerpt: document.querySelector("#post_excerpt").value,
        author: document.querySelector("#author").value,
        published_unix_ts: Number(updatedDate),
        status: document.querySelector("#published").checked ? "published" : "draft",
        tags: document.querySelector("#tags").value
      };
      let postIndex = currData.findIndex(x=>x.filepath === fileId);
      let isNew = false;
      if(postIndex === -1) {
        currData.push(postData);
        isNew = true;
      }
      else currData[postIndex] = postData;
      isNew ? toast("Adding new blog post....") : toast("Updating....");
      setUpdatingBlogIndex(true);
      axios({
        method: "POST",
        url: `https://api.moogle.cc/p/tools/update-blog-index`,
        data: currData,
        headers: {'Authorization': details.id_token || authDetails.id_token}
      })
      .then( (response) => {
        isNew ? toast("Added post successfully! Please reload now to see changes.") : toast("Updated sucessfully!");
        onUpdatePosts(JSON.parse(response.data.msg));
        hideAddUpdateBlogModal(undefined);
        setUpdatingBlogIndex(false);
        return response.data;
      })
      .catch(e => {
        toast("Failed to update, please try again later!");
        setUpdatingBlogIndex(false);
        return undefined;
      });
    }else{
      toast("Please fill all fields....");
      return;
    }
  };

  let hideAddUpdateBlogModal = (event) => {
    let modalState = 'closed';
    let modalId = 'modal';
    onModalStateChanged({modalState, modalId, event});
  };

  library.add(faCheckCircle, faEyeSlash);
  
  return(
    <div id="modal" className={`modal ${eventData && eventData.modalId === 'modal' && eventData.modalState === 'open' ? 'is-active' : ''}`} aria-labelledby="modalLabel">
      <div className="modal-background"  onClick={(e) => {hideAddUpdateBlogModal(e)}}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <p className="modal-card-title modal-title" id="modalLabel">{eventData && eventData.post ? UPDATE_TITLE : ADD_TITLE}</p>
          <button className="delete" aria-label="close" onClick={(e) => {hideAddUpdateBlogModal(e)}}></button>
        </header>
        <section className="modal-card-body has-background-primary-light">
          <form className="form">
            <div className="field">
              <label className="label is-small">FileId</label>
              <div className="control">
                <input onChange={handleChange} className={`input is-small ${eventData && eventData.post ? 'is-static' : ''}` } type="text" required id="filepath" name="filepath" placeholder="Filepath (copy/paste from email)" value={currentPost.filepath} readOnly={eventData && eventData.post ? true : false}/>
              </div>
            </div>
            <div className="field">
              <label className="label is-small">Post Author</label>
              <div className="control">
                <input onChange={handleChange} className="input is-small" type="text" required id="author" name="author" placeholder="John Doe" value={currentPost.author}/>
              </div>
            </div>
            <div className="field">
              <label className="label is-small"> Post Title (7-10 words; Used in: url, browser title, SEO, social media sharing)</label>
              <div className="control">
                <input onChange={handleChange} className="input is-small" type="text" required id="post_title" name="post_title" placeholder="Post Title" value={currentPost.post_title}/>
              </div>
            </div>
            <div className="field">
              <label className="label is-small"> Post Excerpt (50-250 chars; Used in: SEO and social media sharing)</label>
              <div className="control">
                <input onChange={handleChange} className="input is-small" type="text" required id="post_excerpt" name="post_excerpt" placeholder="Post Excerpt" value={currentPost.post_excerpt}/>
              </div>
            </div>
            <div className="field">
              <label className="label is-small"> Tags (csv)</label>
              <div className="control">
                <input onChange={handleChange} className="input is-small" type="text" required id="tags" name="tags" placeholder="tags"/>
              </div>
            </div>
            <div className="control">
              <label className="label is-small"> Visibility of this post?</label>
              <label className="radio">
                <input onChange={handleChange} type="radio" id="published" name="status" value="published" checked={currentPost &&  currentPost.status === 'published' ? true : false}/>
                <small class="px-1">Published </small><FontAwesomeIcon icon={['far', 'check-circle']} size="sm" />
              </label>
              <label className="radio">
                <input onChange={handleChange} type="radio" id="draft" name="status" value="draft" checked={!currentPost ||  currentPost.status === 'draft' ? true : false}/>
                <small class="px-1">Draft </small><FontAwesomeIcon icon={['far', 'eye-slash']} size="sm" />
              </label>
              <p><small class={`${(currentPost &&  currentPost.status === 'draft') ? '' : 'is-hidden'}`}>(No one will be able to see this post)</small></p>
            </div>
            <div className={`flex publishedContainer ${currentPost && currentPost.status !== 'published' ? 'is-hidden' : ''}`}>
              <div className="form-group">
                <label className="label is-small" > Published On (dd-mm-yyyy)</label>
                <input onChange={handleChange} type="date" className="form-control input" required id="published_unix_ts" name="published_unix_ts" placeholder="Published Time" value={ convertTime(currentPost.published_unix_ts !== "" ? currentPost.published_unix_ts : Date.now())}/>
                <p><small class={`${dateDiff(currentPost.published_unix_ts, Date.now()) > 0 ? '' : 'is-hidden'}`}>(You picked a date in the future. This post will go live when the above date arrives (in UTC))</small></p>
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          <button className={`button is-small has-background-dark has-text-white ${updatingBlogIndex ? 'is-loading' : ''}`} id="addOrUpdateBtn" onClick={verifyData} disabled={updatingBlogIndex}>{currentPost ? UPDATE_TITLE : ADD_TITLE}</button>
          {
            /*eventData && eventData.post ? 
              <button className='button is-danger is-outlined' onClick={verifyData}>Delete Post</button> : <></>*/
          }
        </footer>
      </div>
    </div>
  )
}

export default BlogPostModal;
