export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: secure, // Ensures the cookie is only sent over HTTPS in production
      sameSite: secure ? "strict" : "lax",
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
