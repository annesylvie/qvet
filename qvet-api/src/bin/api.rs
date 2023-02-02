use qvet_api::api_app;
use qvet_api::github_oauth2_client;
use qvet_api::runtime;
use qvet_api::serve;

async fn run(args: runtime::Args) -> anyhow::Result<()> {
    let (client_id, client_secret) = runtime::github_credentials_from_env()?;
    let app = api_app(github_oauth2_client(client_id, client_secret)?);
    serve(&args.bind, app).await?;
    Ok(())
}

#[tokio::main]
async fn main() {
    runtime::init_logging();
    let args = runtime::parse_args();

    runtime::error_report(run(args).await);
}
