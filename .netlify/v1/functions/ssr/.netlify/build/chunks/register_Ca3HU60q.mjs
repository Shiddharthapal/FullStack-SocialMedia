import { c as connect } from './connection_CMlIs3zC.mjs';
import { u as userDetails } from './user_C73S1FJ6.mjs';
import jwt from 'jsonwebtoken';

const POST = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const { email, firstName, lastName, password } = body;
    await connect();
    let token = null;
    const user = await userDetails.findOne({
      email
    });
    if (user) {
      return new Response(
        JSON.stringify({
          message: "User already exists"
        }),
        {
          status: 409,
          headers
        }
      );
    }
    const users = new userDetails({
      email,
      firstName,
      lastName,
      password
    });
    users.email = email;
    users.firstName = firstName;
    users.lastName = lastName;
    users.password = password;
    await users.save();
    token = jwt.sign(
      { userId: users._id },
      undefined                           || "your_jwt_secret_here",
      { expiresIn: "24h" }
    );
    let _id = users._id;
    return new Response(
      JSON.stringify({
        _id,
        token,
        message: "Registration successful"
      }),
      {
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    let errorMessage = "Internal server error";
    let statusCode = 500;
    if (error.name === "ValidationError") {
      statusCode = 400;
      const validationError = error;
      errorMessage = Object.values(validationError.errors)[0].message;
    }
    return new Response(
      JSON.stringify({
        message: errorMessage
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json"
        }
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
