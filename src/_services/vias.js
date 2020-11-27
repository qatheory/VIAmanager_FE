import axios from "axios";
import Constants from "_helpers/localConstants.js";
import Commons from "_helpers/commons.js";

let header = Commons.header();
export default {
	checkStoredVia: async (id) => {
		let header = Commons.header();

		try {
			let viaStatus = await axios({
				url: `${Constants.API_DOMAIN}/api/via-check/${id}/`,
				method: "GET",
				headers: header,
			});
			return viaStatus.data;
		} catch (err) {
			console.log(err.response.data);
			return { success: false, messages: "Đã xảy ra lỗi không xác định" };
		}
	},
	checkVia: async (id) => {
		try {
			await axios({
				url: `https://graph.facebook.com/v8.0/me`,
				method: "GET",
				params: { access_token: id },
			});

			return {
				message: "Kiểm tra thành công",
				status: "success",
			};
		} catch (err) {
			console.log(err.response.data);
			if (err.response.data.error) {
				return {
					message: "Access token không hoạt động",
					status: "error",
					error: err,
				};
			}
			return {
				message: "Đã có lỗi xảy ra!!!",
				status: "error",
				error: err,
			};
		}
	},
	checkAllVias: async () => {
		let header = Commons.header();
		try {
			let viasStatus = await axios({
				url: `${Constants.API_DOMAIN}/api/via-check-all/`,
				method: "POST",
				headers: header,
			});
			return viasStatus.data;
		} catch (err) {
			console.log(err);
			return {
				success: false,
				message: "Đã xảy ra lỗi không xác định",
				errors: err,
			};
		}
	},
	createVia: async (data) => {
		try {
			await axios({
				url: `${Constants.API_DOMAIN}/api/vias/`,
				method: "POST",
				headers: header,
				data: data,
			});
			return {
				message: "Tạo via thành công",
				status: "success",
			};
		} catch (err) {
			console.log(err.response.data);
			if (err.response.data.error) {
				return {
					message: "Access token không hoạt động",
					status: "error",
					error: err,
				};
			}
			return {
				message: "Đã có lỗi xảy ra!!!",
				status: "error",
				error: err,
			};
		}
	},
};
