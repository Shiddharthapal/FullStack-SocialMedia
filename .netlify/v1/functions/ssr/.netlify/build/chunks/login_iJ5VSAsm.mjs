import { c as connect } from './connection_CMlIs3zC.mjs';
import { u as userDetails } from './user_C73S1FJ6.mjs';
import jwt from 'jsonwebtoken';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          message: "Email and password are required"
        }),
        {
          status: 400,
          headers
        }
      );
    }
    await connect();
    const user = await userDetails.findOne({
      email
    });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "Invalid email or password"
        }),
        {
          status: 401,
          headers
        }
      );
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Invalid email or password"
        }),
        {
          status: 401,
          headers
        }
      );
    }
    const token = jwt.sign(
      { userId: user._id },
      undefined                           || "your_jwt_secret_here",
      { expiresIn: "24h" }
    );
    return new Response(
      JSON.stringify({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        token,
        message: "Login successful"
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error"
      }),
      {
        status: 500,
        headers
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
