const setHeader = () => {
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
};

export default {
  header: setHeader(),
};
