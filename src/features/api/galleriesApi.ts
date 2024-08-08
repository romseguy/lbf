import { IOrg } from "models/Org";
import { IGallery } from "models/Gallery";
import { objectToQueryString } from "utils/query";
import { api, TagTypes } from "./";

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
        //console.log("addGallery: payload", payload);

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
              type: TagTypes.ORGS,
              id: params.payload.org?._id
            }
            //{ type: TagTypes.Subscriptions, id: globalEmail }
          ];

        return [
          { type: TagTypes.ORGS, id: "LIST" }
          //{ type: TagTypes.Subscriptions, id: params.payload.email || "LIST" }
        ];
      }
    }),
    deleteGallery: build.mutation<IGallery, string>({
      query: (galleryId) => ({ url: `gallery/${galleryId}`, method: "DELETE" }),
      invalidatesTags: (result, error, params) => {
        if (result?.org?._id)
          return [
            { type: TagTypes.ORGS, id: "LIST" },
            {
              type: TagTypes.ORGS,
              id: result?.org?._id
            }
          ];

        return [{ type: TagTypes.ORGS, id: "LIST" }];
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
        //console.groupCollapsed("editGallery");
        //console.log("editGallery: galleryId", galleryId);
        //console.log("editGallery: payload", payload);
        //console.groupEnd();

        return {
          url: `gallery/${galleryId ? galleryId : payload.gallery._id}`,
          method: "PUT",
          body: payload
        };
      },
      invalidatesTags: (result, error, params) => {
        if (error || !result) return [];

        let tags = [{ type: TagTypes.GALLERIES, id: result._id }];

        if (result.org) {
          tags.push({
            type: TagTypes.ORGS,
            id: result.org as unknown as string
          });
        }

        return tags;
      }
    }),
    getGallery: build.query<IGallery, GetGalleryParams>({
      query: ({ galleryId, ...query }) => {
        //console.groupCollapsed("getGallery");
        //console.log("galleryId", galleryId);
        //console.groupEnd();

        return {
          url: `gallery/${galleryId}${
            Object.keys(query).length > 0
              ? `?${objectToQueryString(query)}`
              : ""
          }`
        };
      },
      providesTags: (result, error, params) => [
        { type: TagTypes.GALLERIES, id: result?._id }
      ]
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
