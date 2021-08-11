import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify';
import './blog-metadata.css';
import {postBlogDetails} from '../../utils';

const BlogMetadata = ({blogDetailsIsVisible, config, constants, onUpdateConstants, onBlogDetailsIsVisibleChanged}) => {
  const [blogDetails, setBlogDetails] = useState({
    AUTO_PUBLISH: false,
    FOOTER: "",
    TITLE: "",
    TWITTER_URL: "",
    FACEBOOK_URL: "",
    INSTAGRAM_URL: "",
    SUBSCRIPTION_EMBED: "",  
  });


  useEffect(() => {
    if(constants) {
      setBlogDetails({...constants, AUTO_PUBLISH: constants.AUTO_PUBLISH || false});
    }
  }, [constants]);
  
  const [updatingBlogMetadata, setUpdatingBlogMetadata] = useState(false);
  
  const stripCRLFTDoubleQuotesFromString = (string) => string.replace(/[\n\r\t]/g, "").replace(/"/g, "'");

  const updateBlogDetails = async (data) => {
    console.log(`Submitting ${JSON.stringify(data)} to ${config.BLOG_DETAILS_UPDATE_URL}`);
    setUpdatingBlogMetadata(true);
    return await postBlogDetails(data, config.BLOG_DETAILS_UPDATE_URL)
    .then(res => {
      if('profile.png' in data) delete data['profile.png'];
      onUpdateConstants(JSON.parse(res.data.msg));
      toast(config.METADATA_UPDATED);
      setUpdatingBlogMetadata(false);
    }).catch(err => {
      toast(config.METADATA_UPDATE_FAILED);
      setUpdatingBlogMetadata(false);
    });
  };
  const handleChange = (e) => {
    let {name, value} = e.target;
    if(name === "AUTO_PUBLISH") value = !blogDetails.AUTO_PUBLISH;
    if(name === "SUBSCRIPTION_EMBED") value = stripCRLFTDoubleQuotesFromString(value);
    setBlogDetails({...blogDetails, [name]:value});
  }
  const closeEditModal = () => document.getElementById("editModalCancelBtn").click();
  const handleUpdateBlogDetails = async (e) =>{
    e.preventDefault();
    let fbUrlCorrect = false, insUrlCorrect = false, twUrlCorrect = false;
    if(blogDetails){
      fbUrlCorrect = !blogDetails.FACEBOOK_URL || blogDetails.FACEBOOK_URL.match(config.FB_URL) || blogDetails.FACEBOOK_URL === "";
      insUrlCorrect = !blogDetails.INSTAGRAM_URL || blogDetails.INSTAGRAM_URL.match(config.INS_URL) || blogDetails.INSTAGRAM_URL === "";
      twUrlCorrect = !blogDetails.TWITTER_URL || blogDetails.TWITTER_URL.match(config.TW_URL) || blogDetails.TWITTER_URL === "";
    }
    if(fbUrlCorrect && insUrlCorrect && twUrlCorrect){
      let image = document.getElementById("profile_picture").files[0];
      let data = {...blogDetails};
      if(image){
        var reader = new FileReader();
        reader.onloadend = async function () {
            data["profile.png"] = reader.result;
            await updateBlogDetails(data).then(res => closeEditModal());
        }
        reader.readAsDataURL(image);
      }
      updateBlogDetails(data).then(res => closeEditModal());
    }else{
      if(!fbUrlCorrect) toast(config.FB_URL_ERROR);
      if(!insUrlCorrect) toast(config.IG_URL_ERROR);
      if(!twUrlCorrect) toast(config.TW_URL_ERROR);
    }
  }

  return(
    <div className="card" id="editBlogDetailsModal" style={{display: !blogDetailsIsVisible ? "none":""}}>
      <div className="card-header" >
        <h5 className="card-title is-family-secondary" id="modalLabel"> Personalize your blog <span class="is-hidden-desktop" style={{cursor:"pointer"}} onClick={async (e) => {e.preventDefault(); await(onBlogDetailsIsVisibleChanged(false))}}>&#10006;</span></h5>
      </div>
      <div className="card-body has-text-left">
        <form className="form center flex-column" onSubmit={handleUpdateBlogDetails} id="blogDetailForm">
          <div className="form-group mb-5 columns is-vcentered">
            <div class="column">
              <figure class="image is-96x96">
                <img class="is-rounded" src="/profile.png" alt="profile"/>
              </figure>
            </div>
            <div class="column">
              <div class="is-size-6">
                <label className="label" htmlFor="profile_picture"> {config.PIC_SUB_LABEL} </label>
                <input type="file" accept=".png,.jpeg,.jpg,.gif" className="form-control input" id="profile_picture" name="PROFILE_PICTURE" />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="title"> Title </label>
            <input type="text" className="form-control input" id="title" name="TITLE" value={blogDetails.TITLE || ""} placeholder="Title" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="auto-publish-status"> Immediately publish posts sent from your email?</label>
            <input type="checkbox" className="form-control" id="auto-publish-status" name="AUTO_PUBLISH" onChange={handleChange} checked={blogDetails.AUTO_PUBLISH || false}/>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="twitter_url">Twitter URL</label>
            <input type="text" className="form-control input" id="twitter_url" name="TWITTER_URL" value={blogDetails.TWITTER_URL || ""} placeholder="https://twitter.com/ironman" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="facebook_url"> Facebook URL </label>
            <input type="text" className="form-control input" id="facebook_url" name="FACEBOOK_URL" value={blogDetails.FACEBOOK_URL || ""} placeholder="https://www.facebook.com/jack.3304" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="instagram_url"> Instagram URL </label>                  
            <input type="text" className="form-control input" id="instagram_url" name="INSTAGRAM_URL" value={blogDetails.INSTAGRAM_URL} placeholder="https://www.instagram.com/johnsmith/" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="footer"> {config.FOOTER_LABEL}</label> 
            <div style={{fontSize:"12px"}}>Characters: {blogDetails.FOOTER ? blogDetails.FOOTER.length:0} </div>
            <textarea rows="4" type="text" maxLength="250" minLength="50" className="form-control input" id="footer" name="FOOTER" value={blogDetails.FOOTER || ""} placeholder="I love fishing and writing..." onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="footer"> {config.SUBSCRIPTION_EMBED_LABEL}</label> 
            <div style={{fontSize:"12px"}}>{config.SUBSCRIPTION_EMBED_SUBTITLE}</div>
            <textarea rows="4" type="text" minLength="50" className="form-control input" id="subscription-embed" name="SUBSCRIPTION_EMBED" value={blogDetails.SUBSCRIPTION_EMBED || ""} placeholder="https://... OR <div id=..." onChange={handleChange}/>
          </div>
        </form>
      </div>
      <div className="card-footer text-muted">
        <button type="submit" form="blogDetailForm" className={`button is-small has-background-dark has-text-white ${updatingBlogMetadata ? 'is-loading' : ''}`} id="editModalUpdateBtn" disabled={updatingBlogMetadata}> UPDATE </button>
      </div>
    </div>
  )
}

export default BlogMetadata;
