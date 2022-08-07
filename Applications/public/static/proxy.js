const proxyUrl = `/proxy`;

const useFetchProxy = async (url, config) => {
  // Create a default fetch() config
  const {
    method,
    headers,
    mode,
    cache,
    credentials,
    redirect,
    referrerPolicy,
    body,
  } = config;

  const defaultConfig = {
    method: method || "GET",
    headers: headers || {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: mode || "cors",
    cache: cache || "default",
    credentials: credentials || "include",
    redirect: redirect || "follow",
    referrerPolicy: referrerPolicy || "no-referrer",
    body:
      {
        data: body,
        url: url,
      } || null,
  };

  return await fetch(`/proxy`, defaultConfig);
};

const useAxiosProxy = async (url, config) => {
  // Same thing as above but for axios
  const {
    method,
    headers,
    mode,
    cache,
    credentials,
    redirect,
    referrerPolicy,
    body,
    data,
  } = config;

  let configData = null;
  if (body) {
    configData = {
      data: body,
      url: url,
    };
  }
  if (data) {
    configData = {
      data: data,
      url: url,
    };
  }

  const defaultConfig = {
    method: method || "GET",
    headers: headers || {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: mode || "cors",
    cache: cache || "default",
    credentials: credentials || "include",
    redirect: redirect || "follow",
    referrerPolicy: referrerPolicy || "no-referrer",
    data: configData || null,
  };

  console.log("defaultConfig", defaultConfig);

  return await axios({
    url: `/proxy`,
    ...defaultConfig,
  });
};
