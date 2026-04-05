import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from "@/model/user";
import jwt from "jsonwebtoken";

// POST /api/register creates a new user document and returns a token that can
// be used by clients that want to sign the user in right away.
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const body = await request.json();

    const { email, firstName, lastName, password } = body;
    await connect();

    let token = null;
    const user = await UserDetails.findOne({
      email: email,
    });
    if (user) {
      return new Response(
        JSON.stringify({
          message: "User already exists",
        }),
        {
          status: 409,
          headers,
        },
      );
    }
    const users = new UserDetails({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password,
    });
    users.email = email;
    users.firstName = firstName;
    users.lastName = lastName;
    users.password = password;

    await users.save();

    token = jwt.sign(
      { userId: users._id },
      import.meta.env.JWT_SECRET ||
        import.meta.env.PUBLIC_JWT_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" },
    );

    let _id = users._id;
    return new Response(
      JSON.stringify({
        _id,
        token,
        message: "Registration successful",
      }),
      {
        status: 200,
        headers,
      },
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      statusCode = 400;
      const validationError = error as {
        errors: { [key: string]: { message: string } };
      };
      errorMessage = Object.values(validationError.errors)[0].message;
    }

    return new Response(
      JSON.stringify({
        message: errorMessage,
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
