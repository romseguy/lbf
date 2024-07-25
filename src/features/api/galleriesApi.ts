import { IOrg } from "models/Org";
import { IGallery } from "models/Gallery";
import { objectToQueryString } from "utils/query";
import { api } from "./";

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

export interface AddGalleryPayload {
  gallery: Partial<IGallery>;
  org?: IOrg;
}

export interface EditGalleryPayload {
  gallery: Partial<IGallery>;
}

export type GetGalleryParams = {
  galleryId?: string;
};

export const galleryApi = api.injectEndpoints({
  endpoints: (build) => ({
    addGallery: build.mutation<
      IGallery,
      {
        payload: AddGalleryPayload;
      }
    >({
      query: ({ payload }) => {
        console.log("addGallery: payload", payload);

        return {
          url: `galleries`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: (result, error, params) => {
        if (params.payload.org?._id)
          return [
            {
              type: "Orgs",
              id: params.payload.org?._id
            }
            //{ type: "Subscriptions", id: globalEmail }
          ];

        return [
          { type: "Galleries", id: "LIST" }
          //{ type: "Subscriptions", id: params.payload.email || "LIST" }
        ];
      }
    }),
    deleteGallery: build.mutation<IGallery, string>({
      query: (galleryId) => ({ url: `gallery/${galleryId}`, method: "DELETE" }),
      invalidatesTags: (result, error, params) => {
        if (result?.org?._id)
          return [
            { type: "Galleries", id: "LIST" },
            {
              type: "Orgs",
              id: result?.org?._id
            }
          ];

        return [{ type: "Galleries", id: "LIST" }];
      }
    }),
    editGallery: build.mutation<
      IGallery,
      {
        payload: EditGalleryPayload;
        galleryId?: string;
      }
    >({
      query: ({ payload, galleryId }) => {
        console.groupCollapsed("editGallery");
        console.log("editGallery: galleryId", galleryId);
        console.log("editGallery: payload", payload);
        console.groupEnd();

        return {
          url: `gallery/${galleryId ? galleryId : payload.gallery._id}`,
          method: "PUT",
          body: payload
        };
      },
      //@ts-expect-error
      invalidatesTags: (result, error, params) => {
        if (result?.org)
          return [
            { type: "Galleries", id: "LIST" },
            {
              type: "Orgs",
              id: result?.org
            }
          ];

        return [{ type: "Galleries", id: "LIST" }];
      }
    }),
    getGallery: build.query<IGallery, GetGalleryParams>({
      query: ({ galleryId, ...query }) => {
        console.groupCollapsed("getGallery");
        console.log("galleryId", galleryId);
        console.groupEnd();

        return {
          url: `gallery/${galleryId}${
            Object.keys(query).length > 0
              ? `?${objectToQueryString(query)}`
              : ""
          }`
        };
      }
    })
  }),
  overrideExisting: true
});

export const {
  useAddGalleryMutation,
  useDeleteGalleryMutation,
  useEditGalleryMutation,
  useGetGalleryQuery
} = galleryApi;
