#![cfg_attr(not(feature = "std"), no_std, no_main)]
extern crate alloc;

// pink_extension is short for Phala ink! extension
use pink_extension as pink;

#[pink::contract(env=PinkEnvironment)]
mod phat_hello {
    use super::pink;
    use alloc::{format, string::{String, ToString}};
    use pink::{http_get, PinkEnvironment};
    use scale::{Decode, Encode};
    use serde::Deserialize;
    // you have to use crates with `no_std` support in contract.
    use serde_json_core;
    use pink_s3 as s3;

    #[derive(Debug, PartialEq, Eq, Encode, Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        InvalidEthAddress,
        HttpRequestFailed,
        InvalidResponseBody,
    }

    /// Type alias for the contract's result type.
    pub type Result<T> = core::result::Result<T, Error>;

    /// Defines the storage of your contract.
    /// All the fields will be encrypted and stored on-chain.
    /// In this stateless example, we just add a useless field for demo.
    #[ink(storage)]
    pub struct PhatHello {
        demo_field: bool,
    }

    #[derive(Deserialize, Encode, Clone, Debug, PartialEq)]
    pub struct EtherscanResponse<'a> {
        status: &'a str,
        message: &'a str,
        result: &'a str,
    }

    impl PhatHello {
        /// Constructor to initializes your contract
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { demo_field: true }
        }

        #[ink(message)]
        pub fn update_profile(&self, account: String, data: String) -> Result<()> {
            let s3 = connect_s3();
            if data.len() == 0 {
                return Ok(())
            }
            let bucket = "smartcookiesdemo";
            let path = format!("profile/{account}.json");
            s3.put(bucket, &path, data.as_bytes()).expect("failed to update");
            Ok(())
        }

        #[ink(message)]
        pub fn get_profile(&self, account: String) -> Result<String> {
            let s3 = connect_s3();
            let bucket = "smartcookiesdemo";
            let path = format!("profile/{account}.json");

            let result = s3.get(bucket, &path);
            if result == Err(s3::Error::RequestFailed(404)) {
                return Ok("".to_string());
            }
            let str_result = String::from_utf8(result.expect("failed to get")).unwrap();
            Ok(str_result)
        }

        #[ink(message)]
        pub fn recommend(&self, account: String, recommend_type: String) -> Result<String> {
            Ok("".to_string())
        }
    }

    fn connect_s3() -> s3::S3<'static> {
        let endpoint = "buckets.chainsafe.io";
        let region = "us-east-1";
        let access_key = "WPWLNJFYOTZJLFAKXCBN";
        let secret_key = "";

        s3::S3::new(endpoint, region, access_key, secret_key)
            .expect("failed to connect to s3")
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            // when your contract is really deployed, the Phala Worker will do the HTTP requests
            // mock is needed for local test
            pink_extension_runtime::mock_ext::mock_all_ext();

            let phat_hello = PhatHello::new();
            
            let s3 = connect_s3();
            let bucket = "smartcookiesdemo";
            let object_key = "test.json";
            let value = b"{}";

            s3.put(bucket, object_key, value).unwrap();

            let head = s3.head(bucket, object_key).unwrap();
            assert_eq!(head.content_length, value.len() as u64);

            let v = s3.get(bucket, object_key).unwrap();
            assert_eq!(v, value);

            s3.delete(bucket, object_key).unwrap();
        }
    }
}
