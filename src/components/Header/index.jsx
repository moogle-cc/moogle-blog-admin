import React, {useState} from 'react';
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeOpen, faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({config, constants, onModalStateChanged, onBlogDetailsIsVisibleChanged}) => {
  library.add(faPlus, faEnvelopeOpen, faEye);
  const [menuMustBeOpened, setMenuMustBeOpened] = useState(false);
  let showAddUpdateBlogModal = (event) => {
    let modalState = 'open';
    let modalId = 'modal';
    onModalStateChanged({modalState, modalId, event});
  };

  let showHideMenu = () => {
    console.log(`toggling menu state from current state of ${menuMustBeOpened}`);
    setMenuMustBeOpened(!menuMustBeOpened);
  };

  return(
    <nav className="navbar has-shadow is-justify-content-start" role="navigation" aria-label="main navigation">
      <div className="navbar-brand is-family-secondary is-size-5">
        <div className="mt-2">{constants && constants.TITLE ? constants.TITLE : "The Blog"}</div>
        <a role="button" className={`navbar-burger ${menuMustBeOpened ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" href="#dummy" onClick={showHideMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${menuMustBeOpened ? 'is-active' : ''}`}>
        <div className="navbar-start">
        </div>

        <div className="navbar-end">
          <a className="navbar-item is-hidden-mobile" href="/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={['far', 'eye']} size="sm" className="mx-1"/>
          </a>
          <a className="navbar-item link is-text" onClick={async (e) => {e.preventDefault(); showAddUpdateBlogModal(e)}} href="#dummy">
            <FontAwesomeIcon icon={['fas', 'plus']} size="sm" className="mx-1"/> Post
          </a>
          <a className="navbar-item link is-text is-hidden-desktop" onClick={async (e) => {e.preventDefault(); onBlogDetailsIsVisibleChanged(true)}} href="#dummy">
            Metadata
          </a>
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href="#dummy">
              More
            </a>

            <div className="navbar-dropdown">
              <a className="navbar-item" href="mailto:sai@moogle.cc?subject=I%20need%20help!&body=(describe%20your%20issue%20here)" target="_blank" rel="noreferrer">
                Get Support <FontAwesomeIcon icon={['far', 'envelope-open']} size="sm" className="mx-1"/>
              </a>
              <hr className="navbar-divider"/>
              <a className="navbar-item" href="mailto:sai@moogle.cc?subject=I%20found%20a%20bug!&body=(describe%20what%20you%20found)" target="_blank" rel="noreferrer">
                Report an issue <FontAwesomeIcon icon={['far', 'envelope-open']} size="sm" className="mx-1"/>
              </a>
              <hr className="navbar-divider"/>
              <a className="navbar-item is-hidden-desktop" href="/">
                Visit Your Blog <FontAwesomeIcon icon={['fas', 'external-link-alt']} size="sm" className="mx-1"/>
              </a>
            </div>
          </div>
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-small is-primary" href="#dummy" onClick={(e) => {e.preventDefault(); onModalStateChanged({modalState:'open', modalId:'upgrade-modal', event: e});}}>
                <strong>Upgrade</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header;
