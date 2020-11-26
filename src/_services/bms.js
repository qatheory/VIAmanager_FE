import axios from "axios";
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";

export default {
	requestBackup: async (bmid, owners) => {
		let header = Commons.header();
		try {
			let viaStatus = await axios({
				url: `${Constants.API_DOMAIN}/api/bm-backup/`,
				method: "POST",
				headers: header,
				data: { bmid, owners },
			});
			return viaStatus.data;
		} catch (err) {
			console.log(err);
			return { success: false, messages: "Đã xảy ra lỗi không xác định" };
		}
	},
	checkBM: async (bmid, owners) => {
		let header = Commons.header();
		try {
			let bmStatus = await axios({
				url: `${Constants.API_DOMAIN}/api/bm-check/`,
				method: "POST",
				headers: header,
				data: { bmid, viaFbId: owners.join(",") },
			});
			return bmStatus.data;
		} catch (err) {
			console.log(err);
			return {
				success: false,
				messages: "Đã xảy ra lỗi không xác định",
				errors: err,
			};
		}
	},
	checkAllBm: async () => {
		let header = Commons.header();
		try {
			let bmStatus = await axios({
				url: `${Constants.API_DOMAIN}/api/bm-check-all/`,
				method: "POST",
				headers: header,
			});
			return bmStatus.data;
		} catch (err) {
			console.log(err);
			return {
				success: false,
				message: "Đã xảy ra lỗi không xác định",
				errors: err,
			};
		}
	},
};
