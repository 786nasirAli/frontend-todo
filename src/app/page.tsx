import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to Agentic Todo</h1>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Try logging in or check the dashboard at <a href="/dashboard" className="text-blue-500 underline">/dashboard</a>
        </p>
      </div>
    </main>
  );
}
