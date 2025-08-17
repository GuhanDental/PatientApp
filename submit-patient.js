export async function handler(event) {
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbxnZ-paCJddUz90Nes4lHKag47_pkqrsjcgY3U45adzwx2hMqCg39fs8LIWBOGHp0KZLA/exec";

  // ✅ Handle CORS preflight
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

  // ✅ Handle POST requests (patient / billing modules)
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);

      // Decide module
      let endpoint = googleScriptURL;
      if (body.module === "billing") {
        endpoint += "?action=billing";
      } else {
        endpoint += "?action=patient";
      }

      // Forward POST to Google Apps Script
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  // ✅ Handle GET requests (fetch patient/billing data)
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

  // ✅ Invalid method fallback
  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
}
