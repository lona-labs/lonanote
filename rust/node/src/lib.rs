#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use lonanote_core;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
    lonanote_core::sum(a, b)
}
