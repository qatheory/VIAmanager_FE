import axios from "axios";
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";

let header = Commons.header();
export default {
	checkVia: async (id) => {
		let header = Commons.header();

		try {
			let viaStatus = await axios({
				url: `${Constants.API_DOMAIN}/api/check-via/${id}/`,
				method: "GET",
				headers: header,
			});
			return viaStatus.data;
		} catch (err) {
			console.log(err.response.data);
			return { success: false, messages: "Đã xảy ra lỗi không xác định" };
		}
	},
};
