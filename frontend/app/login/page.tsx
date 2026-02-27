import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
    return (
        <main>
            <AuthForm redirect="/dashboard" />
        </main>
    );
}
