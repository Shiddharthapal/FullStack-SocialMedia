import { c as connect } from './connection_CMlIs3zC.mjs';
import { u as userDetails } from './user_C73S1FJ6.mjs';

const GET = async ({ params, request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    let { id } = params;
    await connect();
    let userdetails = await userDetails.findOne({ _id: id });
    return new Response(
      JSON.stringify({
        userdetails
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Can't fetch data",
        error: error instanceof Error ? error.message : "Token verification failed"
      }),
      {
        status: 400,
        headers
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
