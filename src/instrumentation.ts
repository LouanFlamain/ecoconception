export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const Pyroscope = await import("@pyroscope/nodejs");

      Pyroscope.init({
        appName: "ecoshop",
        serverAddress:
          process.env.PYROSCOPE_SERVER_ADDRESS || "http://localhost:4040",
        basicAuthUser: process.env.PYROSCOPE_BASIC_AUTH_USER || "",
        basicAuthPassword: process.env.PYROSCOPE_BASIC_AUTH_PASSWORD || "",
        tags: {
          env: process.env.NODE_ENV || "development",
        },
      });

      Pyroscope.start();
      console.log("Pyroscope profiling started");
    } catch (error) {
      console.warn(
        "Pyroscope not available (native module missing for this platform):",
        (error as Error).message
      );
    }
  }
}
