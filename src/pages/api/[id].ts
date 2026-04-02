import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import userDetails from "@/model/User";

export const GET: APIRoute = async ({ params, request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    let { id } = params;
    await connect();
    let userdetails = await userDetails.findOne({ _id: id });
    // console.log("🧞‍♂️userdetails --->", userdetails);
    return new Response(
      JSON.stringify({
        userdetails,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't fetch data",
        error:
          error instanceof Error ? error.message : "Token verification failed",
      }),
      {
        status: 400,
        headers,
      }
    );
  }
};
