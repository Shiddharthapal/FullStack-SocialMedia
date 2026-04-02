import type { APIRoute } from "astro";
import connect from "@/lib/connection";
import UserDetails from "@/model/User";
import jwt from "jsonwebtoken";
import type { Token } from "@/types/token";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    //console.log("🧞‍♂️body --->", body);
    const { email, password } = body;
    //console.log("email=>", email);
    //console.log("pass=>", password);


    // Connect to database
    await connect();


    const users = await UserDetails.findOne({
      email: email,
    });
    //console.log("🧞‍♂️users --->", users);
    if (!users) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Verify password
    const isPasswordValid = await users.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: "Incorrect Passeord",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const payload: Token = {
      userId: users._id,
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      import.meta.env.JWT_SECRET ||
        import.meta.env.PUBLIC_JWR_SECRET ||
        "your-secret-key",
      { expiresIn: "24h" },
    );

    return new Response(
      JSON.stringify({
        _id: users._id,
        token,
        message: "Login successful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
