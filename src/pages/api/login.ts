import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from "@/model/user";
import jwt from "jsonwebtoken";

// POST /api/login validates credentials and returns a JWT for later requests.
export const POST: APIRoute = async ({ request }) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          message: "Email and password are required",
        }),
        {
          status: 400,
          headers,
        },
      );
    }

    await connect();

    const user = await UserDetails.findOne({
      email,
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "Invalid email or password",
        }),
        {
          status: 401,
          headers,
        },
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Invalid email or password",
        }),
        {
          status: 401,
          headers,
        },
      );
    }

    // The token carries only the user id; the full profile stays in the database.
    const token = jwt.sign(
      { userId: user._id },
      import.meta.env.JWT_SECRET ||
        import.meta.env.PUBLIC_JWT_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" },
    );

    return new Response(
      JSON.stringify({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        token,
        message: "Login successful",
      }),
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Login error:", error);

    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};
