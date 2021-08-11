import moment from 'moment';
import axios from 'axios';

function normalizeDateToLength(UTS) {
	let maxLength = `${Date.now()}`.length;
	if(`${UTS}`.length === maxLength) return moment(UTS);
	if(`${UTS}`.length > maxLength) return moment(parseInt(`${UTS}`.substring(0, maxLength)));
	let diff = maxLength - `${UTS}`.length;
	let xFactor = Math.pow(10, diff);
	return moment(UTS * xFactor);
}

export function convertTime(UTS) {
	return normalizeDateToLength(UTS).format('YYYY-MM-DD');
};

export function dateStringInSeconds(dateString) {
	return new Date(dateString).getTime()/1000;
}

export function dateDiff(a, b) {
	let x = normalizeDateToLength(a);
	let y = normalizeDateToLength(b);
	return x.diff(y);
}

export async function postBlogDetails(data, url) {
	return axios({
      method: "POST",
      url: url,
      data: data,
      headers: {'Authorization': JSON.parse(localStorage.userDetails).id_token}
    });
}