export async function handler(event) {
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbx9hvPjF3nGRDBD9w_xeUqP29mpCA8t2vZeDX06ikX8eSJoKKXR_GU3LhKzgnOVaAkLOA/exec";

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const response = await fetch(googleScriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: event.body,
      });
      const data = await response.json();
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    try {
      const queryParams = new URLSearchParams(event.queryStringParameters).toString();
      const response = await fetch(`${googleScriptURL}?${queryParams}`);
      const data = await response.json();
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
}
