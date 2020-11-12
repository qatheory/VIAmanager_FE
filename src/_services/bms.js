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
			console.log(err.response.data);
			return { success: false, messages: "Đã xảy ra lỗi không xác định" };
		}
	},
};
