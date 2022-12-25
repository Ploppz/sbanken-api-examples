use sbanken::apis::accounts_api::*;
use sbanken::apis::configuration::Configuration;

mod sbanken_api;
use sbanken_api::*;

#[tokio::main]
async fn main() {
    let credentials =
        serde_json::from_str::<Credentials>(&std::fs::read_to_string("credentials.json").unwrap())
            .unwrap();

    let client = sbanken_client(credentials).await.unwrap();
    let config = Configuration {
        base_path: "https://publicapi.sbanken.no/apibeta".to_string(),
        client,
        ..Configuration::new()
    };
    let x = accounts_list(&config).await;
    println!("{:#?}", x);
}
