import React from 'react';
import './style.css';
// import { ToastContainer } from 'react-toastify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {convertTime} from '../../utils';

const Post = ({post, postIndex, showAddUpdateBlogModal}) => {
	library.add(faCheckCircle, faEyeSlash);
	return(
		post ? 
		<div className={`post center ${post.status === 'draft' ? 'has-background-white-ter' : ''}`} id={'post'+ (postIndex+1)} key={postIndex} onClick={(e) => showAddUpdateBlogModal(e, post)}>
			<img src="https://moogle.cc/media/moogle-publish-blog.png" alt="" />
			<h5 className="postTitle">{post.post_title}</h5>
			<p className="author is-size-7">Author : <b>{post.author}</b></p>
			<p className="is-capitalized is-size-7">Visibility : {post.status}<span class="px-1">{post.status === 'published' ? <FontAwesomeIcon icon={['far', 'check-circle']} size="sm" /> : <FontAwesomeIcon icon={['far', 'eye-slash']} size="sm" />}</span></p>
			<p className="is-capitalized is-size-7">Published : <b>{post.published_unix_ts !== "" ? convertTime(post.published_unix_ts) : "n/a"}</b></p>
		</div>
		: <></>
	);
};

export default Post;