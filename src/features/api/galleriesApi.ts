import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { IEvent } from "models/Event";
//import { IGalleryNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { IGallery } from "models/Gallery";
//import { IGalleryMessage } from "models/GalleryMessage";
import { globalEmail } from "pages/_app";
import baseQuery, { objectToQueryString } from "utils/query";
import { Optional } from "utils/types";
import { api } from "./";

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

export interface AddGalleryPayload {
  gallery: Partial<IGallery>;
  org?: IOrg;
}

export interface AddGalleryNotifPayload {
  email?: string;
  event?: IEvent<string | Date>;
  org?: IOrg;
  orgListsNames?: string[];
}

export interface EditGalleryPayload {
  gallery: Partial<IGallery>;
}

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
    // addGalleryNotif: build.mutation<
    //   {
    //     notifications: IGalleryNotification[]
    //   },
    //   {
    //     payload: AddGalleryNotifPayload;
    //     galleryId: string;
    //   }
    // >({
    //   query: ({ payload, galleryId }) => {
    //     console.groupCollapsed("addGalleryNotif");
    //     console.log("addGalleryNotif: galleryId", galleryId);
    //     console.log("addGalleryNotif: payload", payload);
    //     console.groupEnd();

    //     return {
    //       url: `gallery/${galleryId}`,
    //       method: "POST",
    //       body: payload
    //     };
    //   }
    // }),
    deleteGallery: build.mutation<IGallery, string>({
      query: (galleryId) => ({ url: `gallery/${galleryId}`, method: "DELETE" }),
      invalidatesTags: (result, error, params) => {
        // if (result?.org?._id)
        //   return [
        //     {
        //       type: "Orgs",
        //       id: result?.org?._id
        //     }
        //   ];

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
      invalidatesTags: (result, error, params) => {
        // if (params.payload.gallery.org?._id)
        //   return [
        //     {
        //       type: "Orgs",
        //       id: params.payload.gallery.org?._id
        //     }
        //   ];

        return [{ type: "Galleries", id: "LIST" }];
      }
    }),
    getGalleries: build.query<
      IGallery[],
      { createdBy?: string; populate?: string } | void
    >({
      query: (query) => {
        console.groupCollapsed("getGalleries");
        if (query) {
          console.log("query", query);
        }
        console.groupEnd();

        return {
          url: `galleries${query ? `?${objectToQueryString(query)}` : ""}`
        };
      }
    })
  }),
  overrideExisting: true
});

export const {
  useAddGalleryMutation,
  // useAddGalleryDetailsMutation,
  //useAddGalleryNotifMutation,
  useDeleteGalleryMutation,
  useEditGalleryMutation,
  useGetGalleriesQuery
  // useGetGalleryByNameQuery,
  // useGetGalleriesByCreatorQuery
} = galleryApi;
