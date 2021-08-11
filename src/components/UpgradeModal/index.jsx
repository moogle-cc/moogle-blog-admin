import React , {useState , useEffect} from "react";
import {toast} from 'react-toastify';
import './upgrade-modal.css';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faCheckCircle, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {postBlogDetails} from '../../utils';

const UpgradeModal = ({constants, config, eventData, onUpdateConstants, onModalStateChanged}) => {
  const ADD_TITLE = 'Setup your custom domain', UPDATE_TITLE = 'Update your custom domain';
  if(eventData) console.log(`${eventData.modalId}'s state = ${eventData.modalState}`);
  let helpMsgIsShown = false;
  let [customDomain, setCustomDomain] = useState(undefined);
  let currentCustomDomain = constants && constants.CUSTOM_DOMAIN && constants.CUSTOM_DOMAIN.trim().length > 0 ? constants.CUSTOM_DOMAIN.trim().toLowerCase() : undefined;
  const [updatingUpgradeConstant, setUpdatingUpgradeConstant] = useState(false);
  useEffect(() => {
    if(constants && constants.CUSTOM_DOMAIN) setCustomDomain(constants.CUSTOM_DOMAIN);
  }, [constants]);

  const handleChange = (e) => {
    let {name, value} = e.target;
    if(name === 'CUSTOM_DOMAIN') setCustomDomain(value);
  };

  const requiredFieldsAreFilled = () => {
    const customDomain = document.querySelector("#customDomain");
    return customDomain.value !== '';
  };

  const verifyData = () => {
    const addOrUpdateBtn = document.querySelector("#addOrUpdateBtn");
    
    if(!requiredFieldsAreFilled()){
      toast(config.TOAST_MISSING_FIELDS);
      return;
    } 
    addOrUpdateBtn.disabled = false;
    updateConstants();
  };

  const updateConstants = async () => {
    let data = JSON.parse(JSON.stringify(constants));
    data.CUSTOM_DOMAIN = document.querySelector("#customDomain").value;
    setUpdatingUpgradeConstant(true);
    return await postBlogDetails(data, config.BLOG_DETAILS_UPDATE_URL)
    .then(res => {
      if('profile.png' in data) delete data['profile.png'];
      onUpdateConstants(JSON.parse(res.data.msg));
      helpMsgIsShown = true;
      toast(config.METADATA_UPDATED);
      setUpdatingUpgradeConstant(false);
    })
    .catch(x => {
      helpMsgIsShown = false;
      toast(config.METADATA_UPDATE_FAILED)
      setUpdatingUpgradeConstant(false);
    })
  };
  
  return(
    <div id="upgrade-modal" className={`modal px-2 ${eventData && eventData.modalId === 'upgrade-modal' && eventData.modalState === 'open' ? 'is-active' : ''}`} aria-labelledby="modalLabel">
      <div className="modal-background" onClick={(e) => {e.preventDefault(); onModalStateChanged({modalState:'closed', modalId:'upgrade-modal', event: e});}}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <p className="modal-card-title modal-title" id="modalLabel">{currentCustomDomain ? UPDATE_TITLE : ADD_TITLE}</p>
          <button className="delete" aria-label="close" onClick={(e) => {e.preventDefault(); onModalStateChanged({modalState:'closed', modalId:'upgrade-modal', event: e});}}></button>
        </header>
        <section className="modal-card-body has-background-primary-light">
          <form className="form">
            <div className="field">
              <label className="label is-small">Your custom domain</label>
              <div className="control">
                <input onChange={handleChange} className={`input is-small ${currentCustomDomain ? 'is-static' : ''}` } type="text" required id="customDomain" name="CUSTOM_DOMAIN" placeholder="example.com OR blog.example.com" value={customDomain} readOnly={currentCustomDomain ? true : false}/>
                <p className="is-size-7">Fyi, custom domains cost $50/yr. You will receive an invoice via email after the custom domain is fully set up.</p>
              </div>
            </div>
            <small class={`${helpMsgIsShown ? '' : 'is-hidden'}`}>(Check your email for the next steps you will need to take to use Moogle on a custom domain)</small>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          <button className={`button is-small has-background-dark has-text-white ${updatingUpgradeConstant ? 'is-loading' : ''}`} id="addOrUpdateBtn" onClick={verifyData} disabled={updatingUpgradeConstant}>{constants && constants.CUSTOM_DOMAIN ? UPDATE_TITLE : ADD_TITLE}</button>
          {
            /*eventData && eventData.post ? 
              <button className='button is-danger is-outlined' onClick={verifyData}>Delete Post</button> : <></>*/
          }
        </footer>
      </div>
    </div>
  )
}

export default UpgradeModal;
