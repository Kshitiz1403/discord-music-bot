// THIS IS SUPPOSED TO BE A SINGLETON FILE
import SpotifyWebApi from "spotify-web-api-node";
import config from "../../../config";
import cron from "node-cron";
import logger from "../../loaders/logger";

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotify_client_id,
  clientSecret: config.spotify_client_secret,
  redirectUri: config.spotify_redirect_uri,
  refreshToken: config.spotify_refresh_token,
  accessToken: config.spotify_access_token,
});

const refreshToken = () => {
  spotifyApi.refreshAccessToken().then(
    (data) => {
      const access_token = data.body["access_token"];
      spotifyApi.setAccessToken(access_token);
      logger.info("[SPOTIFY] refreshed token");
    },
    (error) => {
      logger.error(error);
    }
  );
};

// Refreshes token on startup and every 50 minutes
refreshToken();
cron.schedule("*/50 * * * *", () => {
  refreshToken();
});
export default spotifyApi;
