---
weight: 100
---

## HTTP Codes

The _dfuse_ API uses the following HTTP error codes:

Error Code | Meaning
:----------: | -------
400 | Bad Request -- Your request is invalid.
401 | Unauthorized -- Your API key is wrong.
403 | Forbidden -- Your request `Origin` does not match or while authenticated, you do not have access to specified resource.
404 | Not Found -- The specified resource could not be found.
405 | Method Not Allowed -- You are using an HTTP verb that is not allowed for this resource.
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Service Unavailable -- We're temporarily offline for maintenance. Please try again later.

The HTTP response will always contain a body with a specific error format that is defined
in the section below. If the body does not contain anything or is not in the format
described below, please report this as a bug to our team.

## Error Format

Each error message structure for both the REST API and WebSocket API is
fully standardized across all our API calls.

The format is as follows:

{{< highlight json >}}
{
    "code": "a_unique_error_code_for_this_specific_error",
    "trace_id": "unique_id_identifying_your_request",
    "message": "A descriptive error message about the problem.",
    "details": {
        "key": "contextual key/values pairs specific to each error"
    }
}
{{< /highlight >}}

Each error returned to you has a unique `code` field which descriptively identifies
the error. The error code is stable in time and can be programmatically relied upon
in your code to process the error.

The `trace_id` uniquely identifies your request, will change upon each request, being
unique across all traces. This can be provided to our support team when investigating
problems.

The `message` is a human-readable english string about why the error happened and what went wrong.
It may change over time and should **not** be used to determine what the error was.
Use the `code` field for that purpose.

The `details` is a key/value pair object and is optional, so it might or might not be present.
It contains error-specific details about what went wrong for a given error code. It's unique
per `code`, and can be used programmatically to extract information about the error.

Name | Type | Options | Description
-----|------|---------|------------
`code` | `string` | required | Unique `code` field which descriptively identifies the error.
`trace_id` | `string` | required | Unique identifier of the request.
`message` | `string` | required | Human-readable english string about why the error happen and what was wrong, never translated.
`details` | `map<string, any>` | optional | Key/value pair object contains specific details about what went wrong for a given error code.
