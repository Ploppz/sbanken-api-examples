use anyhow::{Context, Result};
use reqwest::header::{self, HeaderMap, HeaderValue};
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Credentials {
    /// Personnummer
    pub user_id: String,
    /// Application key received from API Beta in the internetbank
    pub client_id: String,
    /// Password received from API Beta in the internetbank
    pub secret: String,
}

pub async fn get_access_token(creds: Credentials) -> Result<String> {
    let identity_server_url = "https://auth.sbanken.no/identityserver/connect/token";

    // create basicAuth header value according to Oauth 2.0 standard
    let basic_auth = base64::encode(format!(
        "{}:{}",
        urlencoding::encode(&creds.client_id),
        urlencoding::encode(&creds.secret)
    ));

    let client = reqwest::Client::new();

    let response = client
        .post(identity_server_url)
        .body("grant_type=client_credentials")
        .header("Authorization", format!("Basic {}", basic_auth))
        .header("Content-Type", "application/x-www-form-urlencoded")
        .header("Accept", "application/json")
        .header("customerId", creds.user_id)
        .send()
        .await?;

    let json = response.json::<serde_json::Value>().await?;

    json.get("access_token")
        .and_then(|x| x.as_str())
        .map(|x| x.to_string())
        .context("Access token not received")
}

pub async fn sbanken_client(creds: Credentials) -> Result<Client> {
    let token = get_access_token(creds).await?;
    let mut default_headers = HeaderMap::new();

    let mut auth_value = HeaderValue::from_str(&format!("Bearer {}", token))?;
    auth_value.set_sensitive(true);

    default_headers.insert(header::AUTHORIZATION, auth_value);
    default_headers.insert(header::ACCEPT, HeaderValue::from_str("application/json")?);
    Ok(reqwest::Client::builder()
        .default_headers(default_headers)
        .build()?)
}
