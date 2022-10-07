export const fetchApi = async (url, opts) => {
  try {
    const options = {
      ...opts,
      headers: {
        "x-access-token": localStorage.getItem("access_token"),
        ...opts.headers,
      },
    };
    const res = await fetch(url, options);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};
