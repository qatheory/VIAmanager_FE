const setHeader = (window) => {
	if (window.sessionStorage.getItem("token")) {
		return {
			Authorization: `JWT ${sessionStorage.getItem("token")}`,
		};
	} else if (window.localStorage.getItem("token")) {
		return {
			Authorization: `JWT ${localStorage.getItem("token")}`,
		};
	}
	return {};
};

export default {
	header: () => {
		if (sessionStorage.getItem("token")) {
			return {
				Authorization: `JWT ${sessionStorage.getItem("token")}`,
			};
		} else if (localStorage.getItem("token")) {
			return {
				Authorization: `JWT ${localStorage.getItem("token")}`,
			};
		}
		return {};
	},
};
