export async function handler(event) {
  const googleScriptURL = "https://script.google.com/macros/s/AKfycbxnZ-paCJddUz90Nes4lHKag47_pkqrsjcgY3U45adzwx2hMqCg39fs8LIWBOGHp0KZLA/exec";

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
      const body = JSON.parse(event.body);

      // 🔹 Decide which module this request belongs to
      let endpoint = googleScriptURL;
      if (body.module === "billing") {
        endpoint = googleScriptURL + "?action=billing"; // billing module
      } else {
        endpoint = googleScriptURL + "?action=patient"; // default: patient module
      }

      const response = await fetch("/.netlify/functions/submit-patient", {
  method: "POST",
  body: JSON.stringify(updatedData)
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

