async function Call(baseUri, useCase, dtoIn, method) {
  let response;
  if (!method || method === "get") {
    response = await fetch(
      `${baseUri}/${useCase}${
        dtoIn && Object.keys(dtoIn).length
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`
    );
  } else {
    response = await fetch(`${baseUri}/${useCase}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

const baseUri = "http://localhost:8888";

const FetchHelper = {
  trip: {
    get: async (dtoIn) => Call(baseUri, "trip/get", dtoIn, "get"),
    create: async (dtoIn) => Call(baseUri, "trip/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "trip/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "trip/delete", dtoIn, "post"),
    list: async () => Call(baseUri, "trip/list", null, "get"),
    addItem: async (dtoIn) => Call(baseUri, "trip/addItem", dtoIn, "post"),
    removeItem: async (dtoIn) => Call(baseUri, "trip/removeItem", dtoIn, "post"),
    updateItemStatus: async (dtoIn) => Call(baseUri, "trip/updateItemStatus", dtoIn, "post"),
  },
  item: {
    get: async (dtoIn) => Call(baseUri, "item/get", dtoIn, "get"),
    create: async (dtoIn) => Call(baseUri, "item/create", dtoIn, "post"),
    update: async (dtoIn) => Call(baseUri, "item/update", dtoIn, "post"),
    delete: async (dtoIn) => Call(baseUri, "item/delete", dtoIn, "post"),
    list: async () => Call(baseUri, "item/list", null, "get"),
  },
};

export default FetchHelper;