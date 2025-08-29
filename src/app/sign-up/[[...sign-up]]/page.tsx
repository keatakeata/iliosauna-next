import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-orange-500 hover:bg-orange-600',
            card: 'bg-white shadow-xl',
          }
        }}
      />
    </div>
  );
}