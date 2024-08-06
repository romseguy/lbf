//@ts-nocheck
import React from "react";
import { isServer } from "utils/isServer";
import { isSame } from "utils/object";
import { ScriptCache } from "./ScriptCache";
import GoogleApi from "./GoogleApi";

export const withGoogleApi =
  (input) => (WrappedComponent: React.ComponentType<any>) => {
    return class Wrapper extends React.Component<any, any> {
      constructor(props) {
        super(props);
        const options = typeof input === "function" ? input(props) : input;
        this.initialize(options);
        this.state = {
          loaded: false,
          map: null,
          google: null,
          options
        };
      }

      UNSAFE_componentWillReceiveProps(props) {
        if (typeof input !== "function") {
          return;
        }

        const options = input(props);
        const prevOptions = this.state.options;

        if (isSame(options, prevOptions)) {
          return;
        }

        this.initialize(options);
        this.setState({
          options,
          loaded: false,
          google: null
        });
      }

      componentWillUnmount() {
        if (this.unregisterLoadHandler) {
          this.unregisterLoadHandler();
        }
      }

      createCache(options) {
        //if (this.scriptCache) return this.scriptCache;
        options = options || {};
        const apiKey = options.apiKey;
        const libraries = options.libraries || ["places"];
        const version = options.version || "3";
        const language = options.language || "en";
        const url = options.url;
        const client = options.client;
        const region = options.region;

        return ScriptCache({
          google: GoogleApi({
            apiKey: apiKey,
            language: language,
            libraries: libraries,
            version: version,
            url: url,
            client: client,
            region: region
          })
        });
      }

      initialize(options) {
        if (this.unregisterLoadHandler) {
          this.unregisterLoadHandler();
          this.unregisterLoadHandler = null;
        }
        const createCache = options.createCache || this.createCache;
        this.scriptCache = createCache(options);
        this.unregisterLoadHandler = this.scriptCache.google.onLoad(
          this.onLoad.bind(this)
        );
      }

      onLoad(err, tag) {
        this._gapi = window.google;
        this.setState({ loaded: true, google: this._gapi });
      }

      render() {
        if (isServer()) return <WrappedComponent {...this.props} />;

        const props = Object.assign({}, this.props, {
          loaded: this.state.loaded,
          google: window.google
        });

        return <WrappedComponent {...props} />;
      }
    };
  };
